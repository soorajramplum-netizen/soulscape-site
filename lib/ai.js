// lib/ai.js — AI fallback chain: Gemini → Groq → OpenRouter

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash']
const GROQ_MODELS   = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
const OR_MODELS     = ['google/gemini-2.0-flash-001', 'meta-llama/llama-3.3-70b-instruct']

async function tryGemini(prompt, key, maxTokens) {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: maxTokens },
          }),
          signal: AbortSignal.timeout(25000),
        }
      )
      if (!res.ok) { console.warn('Gemini', model, res.status); continue }
      const d = await res.json()
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text
      if (t && t.length > 5) return t
    } catch (e) { console.warn('Gemini', model, e.message) }
  }
  return null
}

async function tryGroq(prompt, key, maxTokens) {
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'Respond with a JSON object only. No markdown. Start with { end with }.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.4,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (!res.ok) { console.warn('Groq', model, res.status); continue }
      const d = await res.json()
      const t = d.choices?.[0]?.message?.content
      if (t && t.length > 5) return t
    } catch (e) { console.warn('Groq', model, e.message) }
  }
  return null
}

async function tryOpenRouter(prompt, key, maxTokens) {
  for (const model of OR_MODELS) {
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
            { role: 'system', content: 'Respond with a JSON object only. No markdown. Start with { end with }.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.4,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) { console.warn('OR', model, res.status); continue }
      const d = await res.json()
      const t = d.choices?.[0]?.message?.content
      if (t && t.length > 5) return t
    } catch (e) { console.warn('OR', model, e.message) }
  }
  return null
}

export async function callAI(prompt, maxTokens = 1500) {
  const gKey = process.env.GEMINI_API_KEY
  const qKey = process.env.GROQ_API_KEY
  const oKey = process.env.OPENROUTER_API_KEY

  if (gKey) { const r = await tryGemini(prompt, gKey, maxTokens); if (r) return { text: r, provider: 'gemini' } }
  if (qKey) { const r = await tryGroq(prompt, qKey, maxTokens);   if (r) return { text: r, provider: 'groq' } }
  if (oKey) { const r = await tryOpenRouter(prompt, oKey, maxTokens); if (r) return { text: r, provider: 'openrouter' } }

  return null
}

// Robust JSON extractor
export function parseJSON(raw) {
  if (!raw) return null
  if (typeof raw === 'object') return raw

  // Strip markdown fences
  let s = raw
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/im, '')
    .trim()

  // Direct parse
  try { return JSON.parse(s) } catch {}

  // Find outermost { }
  const start = s.indexOf('{')
  const end   = s.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)) } catch {}
    // Repair truncated JSON
    let partial = s.slice(start, end + 1)
    partial = partial
      .replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, '')
      .replace(/,\s*"[^"]*"\s*:\s*\[[^\]]*$/, ']')
      .replace(/,\s*"[^"]*"\s*$/, '')
    const oB = (partial.match(/\[/g)||[]).length - (partial.match(/\]/g)||[]).length
    const cB = (partial.match(/\{/g)||[]).length - (partial.match(/\}/g)||[]).length
    try { return JSON.parse(partial + ']'.repeat(Math.max(0,oB)) + '}'.repeat(Math.max(0,cB))) } catch {}
  }

  return null
}
