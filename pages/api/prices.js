import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, destLat, destLng, originCity, tripDays = 7 } = req.body
  if (!destName || !originCity) return res.status(400).json({ error: 'destName and originCity required' })

  const prompt = `A traveller from ${originCity} wants to visit "${destName}" in ${destCountry || 'the world'} for ${tripDays} nights.

First identify the nearest major airport to "${destName}". Examples: "New York at Dusk" = JFK/LGA, "Amalfi Coast" = Naples (NAP), "Swiss Alps" = Zurich (ZRH) or Geneva (GVA), "Sahara Dunes" = Marrakech (RAK), "Aurora Borealis" = Tromso (TOS), "Daintree Rainforest" = Cairns (CNS).

Estimate realistic travel costs. Never use dollar signs — write USD instead.

Respond with a JSON object with exactly these keys:
- nearestCity: actual city the destination is in or near
- nearestAirport: airport name with IATA code in brackets
- distanceFromAirport: travel time from airport to destination
- flights: object with economy (USD range), business (USD range), notes (booking tip)
- hotel: object with budget, mid, luxury (each a USD per night range)
- dailyCost: object with budget, mid (each a USD total per day range)
- bestTime: best months to visit
- currency: local currency and rate from USD
- tips: array of 3 practical tips

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
