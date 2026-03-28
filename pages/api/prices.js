// pages/api/prices.js
// Returns estimated flight + hotel prices for a destination
// Uses AI to generate realistic price estimates based on destination + origin city

import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country, originCity) => `You are a travel price estimator. Give realistic approximate prices for a trip to ${dest}, ${country} for someone travelling from ${originCity}.

Return ONLY valid JSON:
{
  "flights": {
    "economy": "price range in USD like '$450 - $800'",
    "notes": "e.g. direct flights available, or best booked 2-3 months ahead"
  },
  "hotel": {
    "budget": "price per night USD like '$30 - $60'",
    "mid": "price per night USD like '$80 - $150'",
    "luxury": "price per night USD like '$200 - $500'"
  },
  "dailyCost": {
    "budget": "total daily spend budget traveller like '$40 - $60'",
    "mid": "total daily spend mid traveller like '$100 - $150'"
  },
  "bestTime": "e.g. October to March",
  "currency": "local currency name and approx exchange rate from USD",
  "tips": ["one practical money tip", "one practical booking tip"]
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { destName, destCountry, originCity } = req.body
  if (!destName || !originCity) {
    return res.status(400).json({ error: 'destName and originCity required' })
  }

  const aiResult = await callAI(PROMPT(destName, destCountry || '', originCity))

  if (!aiResult) {
    return res.status(503).json({ error: 'AI unavailable', fallback: true })
  }

  const data = parseJSON(aiResult.text)
  if (!data) {
    return res.status(422).json({ error: 'Could not parse price data' })
  }

  res.json({ ...data, provider: aiResult.provider, generatedAt: new Date().toISOString() })
}
