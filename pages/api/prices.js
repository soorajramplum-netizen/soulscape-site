// pages/api/prices.js
import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, originCity } = req.body
  if (!destName || !originCity) {
    return res.status(400).json({ error: 'destName and originCity are required' })
  }

  const prompt = `Estimate travel costs for a trip from ${originCity} to ${destName}, ${destCountry || ''}.
Do NOT use dollar signs anywhere in your response. Use the word USD or the local currency name instead.

Return this exact JSON structure with real estimates:
{
  "flights": {
    "economy": "450 to 800 USD",
    "notes": "Book 2 to 3 months ahead for best prices"
  },
  "hotel": {
    "budget": "30 to 60 USD per night",
    "mid": "80 to 150 USD per night",
    "luxury": "200 to 500 USD per night"
  },
  "dailyCost": {
    "budget": "40 to 70 USD total per day including meals and local transport",
    "mid": "100 to 160 USD total per day"
  },
  "bestTime": "October to March",
  "currency": "Euro (EUR). Approximately 0.92 EUR per 1 USD.",
  "tips": ["Practical money saving tip for this destination", "Practical booking tip for this route"]
}`

  const aiResult = await callAI(prompt, 900)
  if (!aiResult) {
    return res.status(503).json({ error: 'AI unavailable — check your API keys in Vercel environment variables' })
  }

  // Remove any dollar signs that slipped through before parsing
  const cleaned = aiResult.text.replace(/\$\s*/g, '')
  const data = parseJSON(cleaned)

  if (!data || !data.flights) {
    // Still return something displayable
    return res.json({
      parseError: true,
      raw: aiResult.text,
      provider: aiResult.provider,
    })
  }

  return res.json({ ...data, provider: aiResult.provider })
}
