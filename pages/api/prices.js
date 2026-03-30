// pages/api/prices.js
import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, destLat, destLng, originCity } = req.body
  if (!destName || !originCity) return res.status(400).json({ error: 'destName and originCity required' })

  const prompt = `A traveller from ${originCity} wants to visit "${destName}" in ${destCountry || 'the world'}.

First identify: what is the nearest major airport to "${destName}"? This may not be obvious — for example "New York at Dusk" means New York City, "Amalfi Coast" means Naples airport, "Swiss Alps" means Zurich or Geneva, "Sahara Dunes" means Marrakech or Ouarzazate, "Aurora Borealis" means Tromso Norway.

Then estimate travel costs. Do NOT use dollar signs anywhere — write USD or the currency name instead.

Respond with a JSON object with exactly these keys:
- nearestCity: the actual city or region the destination is in (e.g. "New York City" for "New York at Dusk")
- nearestAirport: name and IATA code of nearest major airport (e.g. "John F Kennedy International (JFK)")
- distanceFromAirport: how far the destination is from that airport in km or minutes (e.g. "45 minutes by car")
- flights: object with keys economy (price range string using USD), business (price range string), notes (one booking tip)
- hotel: object with keys budget (per night), mid (per night), luxury (per night) — all strings using USD
- dailyCost: object with keys budget (total per day string), mid (total per day string)
- bestTime: best months to visit as a string
- currency: local currency name and approximate exchange rate from USD as a string
- tips: array of exactly 3 practical money or travel tips as strings

Start your response with { and end with }.`

  const aiResult = await callAI(prompt, 1000)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable. Check API keys in Vercel.' })

  const cleaned = (aiResult.text || '').replace(/\$/g, 'USD ')
  const data = parseJSON(cleaned)

  if (!data || !data.flights) {
    return res.json({ parseError: true, raw: aiResult.text, provider: aiResult.provider })
  }
  return res.json({ ...data, provider: aiResult.provider })
}
