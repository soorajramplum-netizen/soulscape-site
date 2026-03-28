// lib/ai.js — Clean AI fallback chain
// Gemini → Groq → OpenRouter
// All keys from Vercel environment variables, never exposed to browser

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
]

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
]

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
]

const JSON_SYSTEM = 'You must respond with ONLY a valid JSON object. No markdown. No backticks. No explanation before or after. Start your response with { and end with }. Never use dollar signs inside JSON string values.'

async function tryGemini(prompt, key, maxTokens) {
  for (const model of GEMINI_MODELS) {
    try {
      const fullPrompt = JSON_SYSTEM + '\n\n' + prompt
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: maxTokens,
            },
          }),
          signal: AbortSignal.timeout(25000),
        }
      )
      if (!res.ok) {
        console.warn(`Gemini ${model} HTTP ${res.status}`)
        continue
      }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text && text.length > 5) {
        console.log(`Gemini ${model} OK, length=${text.length}`)
        return text
      }
    } catch (e) {
      console.warn(`Gemini ${model} error: ${e.message}`)
    }
  }
  return null
}

async function tryGroq(prompt, key, maxTokens) {
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: JSON_SYSTEM },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.5,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (!res.ok) {
        console.warn(`Groq ${model} HTTP ${res.status}`)
        continue
      }
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text && text.length > 5) {
        console.log(`Groq ${model} OK, length=${text.length}`)
        return text
      }
    } catch (e) {
      console.warn(`Groq ${model} error: ${e.message}`)
    }
  }
  return null
}

async function tryOpenRouter(prompt, key, maxTokens) {
  for (const model of OPENROUTER_MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'HTTP-Referer': 'https://soulscape-xi.vercel.app',
          'X-Title': 'SoulScape',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: JSON_SYSTEM },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.5,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) {
        console.warn(`OpenRouter ${model} HTTP ${res.status}`)
        continue
      }
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text && text.length > 5) {
        console.log(`OpenRouter ${model} OK, length=${text.length}`)
        return text
      }
    } catch (e) {
      console.warn(`OpenRouter ${model} error: ${e.message}`)
    }
  }
  return null
}

export async function callAI(prompt, maxTokens = 1500) {
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey   = process.env.GROQ_API_KEY
  const orKey     = process.env.OPENROUTER_API_KEY

  if (geminiKey) {
    const r = await tryGemini(prompt, geminiKey, maxTokens)
    if (r) return { text: r, provider: 'gemini' }
  }
  if (groqKey) {
    const r = await tryGroq(prompt, groqKey, maxTokens)
    if (r) return { text: r, provider: 'groq' }
  }
  if (orKey) {
    const r = await tryOpenRouter(prompt, orKey, maxTokens)
    if (r) return { text: r, provider: 'openrouter' }
  }
  return null
}

// Robust JSON extractor — handles fences, whitespace, minor truncation
export function parseJSON(raw) {
  if (!raw) return null
  if (typeof raw === 'object') return raw // already parsed

  let s = raw
    .replace(/^[\s\S]*?```json\s*/i, '')   // strip leading ```json
    .replace(/^[\s\S]*?```\s*/i, '')        // strip leading ```
    .replace(/```[\s\S]*$/i, '')            // strip trailing ```
    .trim()

  // Direct parse
  try { return JSON.parse(s) } catch {}

  // Find outermost { }
  const start = s.indexOf('{')
  const end   = s.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    const slice = s.slice(start, end + 1)
    try { return JSON.parse(slice) } catch {}

    // Attempt repair: strip trailing incomplete key-value
    const repaired = slice
      .replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, '')   // incomplete string value
      .replace(/,\s*"[^"]*"\s*:\s*\[[^\]]*$/, ']') // incomplete array
      .replace(/,\s*"[^"]*"\s*$/, '')               // key with no value
    // Balance brackets
    const opens  = (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length
    const braces = (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length
    const closed = repaired + ']'.repeat(Math.max(0, opens)) + '}'.repeat(Math.max(0, braces))
    try { return JSON.parse(closed) } catch {}
  }

  return null
}
