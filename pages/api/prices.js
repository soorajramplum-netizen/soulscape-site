import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, originCity, tripDays = 7 } = req.body
  if (!destName || !originCity) return res.status(400).json({ error: 'destName and originCity required' })

  const prompt = `A traveller from ${originCity} wants to visit "${destName}" in ${destCountry || 'the world'} for ${tripDays} nights.

First identify the nearest major airport. Then check: are there direct flights from ${originCity} to that airport?

Never use dollar signs — write USD instead.

Respond with a JSON object with these keys:
- nearestCity: actual city the destination is in
- nearestAirport: airport name with IATA code like "Cairns Airport (CNS)"
- distanceFromAirport: travel time from airport to destination
- flights: object with keys economy (USD range), business (USD range), notes (booking tip), directAvailable (boolean), connectionCity (hub city name if no direct, else null), connectionTime (layover time if indirect, else null)
- hotel: object with keys mid and luxury only (each USD per night range)
- dailyCost: object with key mid only (USD total per day)
- bestTime: best months as string
- currency: local currency name and rate from USD
- tips: array of 2 practical tips

Start with { and end with }.`

  const aiResult = await callAI(prompt, 1000)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable. Check API keys in Vercel.' })

  const cleaned = (aiResult.text || '').replace(/\$/g, 'USD ')
  const data = parseJSON(cleaned)

  if (!data || !data.flights) {
    return res.json({ parseError: true, raw: aiResult.text, provider: aiResult.provider })
  }
  return res.json({ ...data, provider: aiResult.provider })
}
