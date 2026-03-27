// pages/api/prices.js
import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country, originCity) =>
  `You are a travel price estimator. Return JSON with realistic travel costs for ${dest}, ${country} from ${originCity}.
No markdown, no backticks, no dollar signs anywhere. Use words like "USD" not symbols. Valid JSON only.

{
  "flights": {
    "economy": "450 to 800 USD",
    "notes": "Book 2-3 months ahead. Check Google Flights for best deals."
  },
  "hotel": {
    "budget": "30 to 60 USD per night",
    "mid": "80 to 150 USD per night",
    "luxury": "200 to 500 USD per night"
  },
  "dailyCost": {
    "budget": "40 to 60 USD total per day",
    "mid": "100 to 150 USD total per day"
  },
  "bestTime": "October to April",
  "currency": "Euro (EUR). Roughly 0.92 EUR per 1 USD.",
  "tips": ["Tip 1 specific to this destination", "Tip 2 specific to this destination"]
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, originCity } = req.body
  if (!destName || !originCity) return res.status(400).json({ error: 'destName and originCity required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || '', originCity), 800)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable — check API keys in Vercel' })

  const data = parseJSON(aiResult.text)
  if (!data) {
    // Show raw text rather than blank screen
    return res.json({ raw: aiResult.text, parseError: true, provider: aiResult.provider })
  }
  res.json({ ...data, provider: aiResult.provider })
}
