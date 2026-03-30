// pages/api/debug.js — TEMPORARY: test AI connectivity
// DELETE THIS FILE after debugging is done

export default async function handler(req, res) {
  const results = {}

  // Check env vars exist
  results.env = {
    hasGemini: !!process.env.GEMINI_API_KEY,
    hasGroq: !!process.env.GROQ_API_KEY,
    hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
    orKeyLength: process.env.OPENROUTER_API_KEY?.length || 0,
  }

  // Test Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Reply with the single word: working' }] }],
            generationConfig: { maxOutputTokens: 10, temperature: 0 },
          }),
          signal: AbortSignal.timeout(15000),
        }
      )
      const status = r.status
      const body = await r.json()
      results.gemini = {
        status,
        ok: r.ok,
        text: body.candidates?.[0]?.content?.parts?.[0]?.text || null,
        error: body.error?.message || null,
      }
    } catch (e) {
      results.gemini = { error: e.message }
    }
  } else {
    results.gemini = { error: 'No key set' }
  }

  // Test Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: 'Reply with the single word: working' }],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(15000),
      })
      const status = r.status
      const body = await r.json()
      results.groq = {
        status,
        ok: r.ok,
        text: body.choices?.[0]?.message?.content || null,
        error: body.error?.message || null,
      }
    } catch (e) {
      results.groq = { error: e.message }
    }
  } else {
    results.groq = { error: 'No key set' }
  }

  // Test OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://soulscape-xi.vercel.app',
          'X-Title': 'SoulScape',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct',
          messages: [{ role: 'user', content: 'Reply with the single word: working' }],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(15000),
      })
      const status = r.status
      const body = await r.json()
      results.openrouter = {
        status,
        ok: r.ok,
        text: body.choices?.[0]?.message?.content || null,
        error: body.error?.message || null,
      }
    } catch (e) {
      results.openrouter = { error: e.message }
    }
  } else {
    results.openrouter = { error: 'No key set' }
  }

  res.json(results)
}
