// lib/ai.js
// Tries every key + model combination until one responds
// Keys come from Vercel environment variables — never exposed to browser

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash-lite',
]

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
]

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'mistralai/mistral-7b-instruct',
]

async function tryGemini(prompt, key, maxTokens = 1500) {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: maxTokens,
              responseMimeType: 'application/json',
            },
          }),
          signal: AbortSignal.timeout(20000),
        }
      )
      if (!res.ok) {
        const err = await res.text()
        console.warn(`Gemini ${model} error ${res.status}:`, err.slice(0, 100))
        continue
      }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text && text.length > 10) return text
    } catch (e) {
      console.warn(`Gemini ${model} exception:`, e.message)
      continue
    }
  }
  return null
}

async function tryGroq(prompt, key, maxTokens = 1500) {
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
            {
              role: 'system',
              content: 'You are a helpful assistant. Always respond with valid JSON only. No markdown, no backticks, no explanation — just the JSON object.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) {
        const err = await res.text()
        console.warn(`Groq ${model} error ${res.status}:`, err.slice(0, 100))
        continue
      }
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text && text.length > 10) return text
    } catch (e) {
      console.warn(`Groq ${model} exception:`, e.message)
      continue
    }
  }
  return null
}

async function tryOpenRouter(prompt, key, maxTokens = 1500) {
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
            {
              role: 'system',
              content: 'Respond with valid JSON only. No markdown, no backticks, no explanation.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (!res.ok) {
        const err = await res.text()
        console.warn(`OpenRouter ${model} error ${res.status}:`, err.slice(0, 100))
        continue
      }
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text && text.length > 10) return text
    } catch (e) {
      console.warn(`OpenRouter ${model} exception:`, e.message)
      continue
    }
  }
  return null
}

// Main export — tries all 3 providers in order
export async function callAI(prompt, maxTokens = 1500) {
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  const openrouterKey = process.env.OPENROUTER_API_KEY

  if (geminiKey) {
    const result = await tryGemini(prompt, geminiKey, maxTokens)
    if (result) return { text: result, provider: 'gemini' }
  }

  if (groqKey) {
    const result = await tryGroq(prompt, groqKey, maxTokens)
    if (result) return { text: result, provider: 'groq' }
  }

  if (openrouterKey) {
    const result = await tryOpenRouter(prompt, openrouterKey, maxTokens)
    if (result) return { text: result, provider: 'openrouter' }
  }

  return null
}

// Parse JSON from AI response safely — handles markdown fences, trailing commas, etc
export function parseJSON(text) {
  if (!text) return null

  // Strip markdown fences
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  // Try direct parse first
  try { return JSON.parse(cleaned) } catch {}

  // Extract first {...} block
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) } catch {}
    // Try fixing truncated JSON by finding last complete property
    try {
      let partial = objMatch[0]
      // Remove trailing incomplete property
      partial = partial.replace(/,\s*"[^"]*"\s*:\s*[^,}\]]*$/, '')
      // Close any open arrays/objects
      const opens = (partial.match(/\[/g) || []).length - (partial.match(/\]/g) || []).length
      const openBraces = (partial.match(/\{/g) || []).length - (partial.match(/\}/g) || []).length
      partial += ']'.repeat(Math.max(0, opens)) + '}'.repeat(Math.max(0, openBraces))
      return JSON.parse(partial)
    } catch {}
  }

  // Extract first [...] block
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]) } catch {}
  }

  return null
}
