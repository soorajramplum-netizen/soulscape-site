import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, originCity, tripDays = 7 } = req.body
  if (!destName || !originCity) return res.status(400).json({ error: 'destName and originCity required' })

  const prompt = `A traveller from ${originCity} wants to visit "${destName}" in ${destCountry || ''} for ${tripDays} nights.

Task 1: Identify the nearest major airport to "${destName}".
Task 2: Check if direct flights exist from ${originCity} to that airport.
Task 3: Estimate costs. Never use dollar signs, write USD instead.

Return a flat JSON object. Every price field must be a plain string like "800 to 1200 USD" — never a nested object.

Required keys:
nearestCity — string, the city or region the destination is in
nearestAirport — string, airport name and IATA code e.g. "Cairns Airport (CNS)"
distanceFromAirport — string, travel time e.g. "1 hour 30 minutes by car"
flightEconomy — string, economy price range e.g. "900 to 1400 USD"
flightBusiness — string, business price range e.g. "2000 to 3500 USD"
flightNotes — string, one booking tip
flightDirect — boolean, true if direct flights exist from ${originCity}
flightConnectionCity — string or null, hub city if no direct flight e.g. "Dubai"
flightConnectionTime — string or null, layover time e.g. "2 to 4 hours"
hotelMid — string, mid-range hotel per night e.g. "80 to 150 USD per night"
hotelLuxury — string, luxury hotel per night e.g. "250 to 500 USD per night"
dailyMid — string, total daily spend e.g. "80 to 130 USD per day"
bestTime — string, best months to visit
currency — string, local currency and exchange rate e.g. "Euro (EUR), 1 USD = 0.92 EUR"
tip1 — string, practical travel tip
tip2 — string, practical travel tip

Start with { and end with }.`

  const aiResult = await callAI(prompt, 900)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable. Check API keys in Vercel.' })

  const cleaned = (aiResult.text || '').replace(/\$/g, 'USD ')
  const raw = parseJSON(cleaned)

  if (!raw || !raw.flightEconomy) {
    return res.json({ parseError: true, raw: aiResult.text, provider: aiResult.provider })
  }

  // Reshape into the structure PriceDisplay expects
  const data = {
    nearestCity: raw.nearestCity,
    nearestAirport: raw.nearestAirport,
    distanceFromAirport: raw.distanceFromAirport,
    flights: {
      economy: raw.flightEconomy,
      business: raw.flightBusiness,
      notes: raw.flightNotes,
      directAvailable: raw.flightDirect,
      connectionCity: raw.flightConnectionCity,
      connectionTime: raw.flightConnectionTime,
    },
    hotel: {
      mid: raw.hotelMid,
      luxury: raw.hotelLuxury,
    },
    dailyCost: {
      mid: raw.dailyMid,
    },
    bestTime: raw.bestTime,
    currency: raw.currency,
    tips: [raw.tip1, raw.tip2].filter(Boolean),
    provider: aiResult.provider,
  }

  return res.json(data)
}
