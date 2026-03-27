// pages/api/prices.js
import { callAI } from '../../lib/ai'

const PROMPT = (dest, country, originCity) =>
  `You are a travel price estimator. Give realistic prices for a trip to ${dest}, ${country} from ${originCity}.

IMPORTANT: Do NOT use dollar signs ($) or any currency symbols in the JSON values. Use only plain numbers and words like "USD" or "INR".

Return ONLY this exact JSON structure with no extra text:
{
  "flights": {
    "economy": "450 to 800 USD",
    "notes": "Best booked 2-3 months ahead. Check Google Flights."
  },
  "hotel": {
    "budget": "30 to 60 USD per night",
    "mid": "80 to 150 USD per night",
    "luxury": "200 to 500 USD per night"
  },
  "dailyCost": {
    "budget": "40 to 60 USD per day",
    "mid": "100 to 150 USD per day"
  },
  "bestTime": "October to March",
  "currency": "Swiss Franc (CHF). 1 USD approx 0.90 CHF",
  "tips": ["Book accommodation early in peak season", "Look for combo flight and hotel deals"]
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { destName, destCountry, originCity } = req.body
  if (!destName || !originCity) {
    return res.status(400).json({ error: 'destName and originCity required' })
  }

  const aiResult = await callAI(PROMPT(destName, destCountry || '', originCity))

  if (!aiResult) {
    return res.status(503).json({ error: 'AI service unavailable. Check your API keys in Vercel environment variables.' })
  }

  // Clean up the response — remove $ signs which break JSON
  let cleaned = aiResult.text
    .replace(/\$\s*/g, '')
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  // Extract JSON
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) {
    // Return the raw text as a fallback display
    return res.status(200).json({
      raw: aiResult.text,
      provider: aiResult.provider,
      parseError: true
    })
  }

  try {
    const data = JSON.parse(match[0])
    res.json({ ...data, provider: aiResult.provider })
  } catch (e) {
    res.status(200).json({
      raw: aiResult.text,
      provider: aiResult.provider,
      parseError: true
    })
  }
}
