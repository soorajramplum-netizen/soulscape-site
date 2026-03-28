// lib/ai.js
// Tries every key + model combination until one responds
// Keys come from Vercel environment variables — never exposed to browser

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
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

async function tryGemini(prompt, key) {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
          }),
          signal: AbortSignal.timeout(8000),
        }
      )
      if (!res.ok) continue
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    } catch {
      continue
    }
  }
  return null
}

async function tryGroq(prompt, key) {
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
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text) return text
    } catch {
      continue
    }
  }
  return null
}

async function tryOpenRouter(prompt, key) {
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
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        }),
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text) return text
    } catch {
      continue
    }
  }
  return null
}

// Main export — tries all 3 providers in order
export async function callAI(prompt) {
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  const openrouterKey = process.env.OPENROUTER_API_KEY

  if (geminiKey) {
    const result = await tryGemini(prompt, geminiKey)
    if (result) return { text: result, provider: 'gemini' }
  }

  if (groqKey) {
    const result = await tryGroq(prompt, groqKey)
    if (result) return { text: result, provider: 'groq' }
  }

  if (openrouterKey) {
    const result = await tryOpenRouter(prompt, openrouterKey)
    if (result) return { text: result, provider: 'openrouter' }
  }

  return null
}

// Parse JSON from AI response safely
export function parseJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
  } catch {}
  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
  } catch {}
  return null
}
