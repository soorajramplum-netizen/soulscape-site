import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry, originCity } = req.body
  if (!destName || !originCity) return res.status(400).json({ error: 'destName and originCity required' })

  const prompt = `Estimate travel costs from ${originCity} to ${destName}${destCountry ? ', ' + destCountry : ''}.
Do not use the dollar sign symbol anywhere. Write prices as numbers followed by USD.

Reply with this JSON object and nothing else:
{"flights":{"economy":"500 to 900 USD","notes":"Book 2 months ahead via Google Flights."},"hotel":{"budget":"40 to 70 USD per night","mid":"90 to 160 USD per night","luxury":"220 to 500 USD per night"},"dailyCost":{"budget":"50 to 80 USD per day","mid":"110 to 170 USD per day"},"bestTime":"October to March","currency":"Euro (EUR). About 0.92 EUR per 1 USD.","tips":["Tip one for saving money here.","Tip two for booking smartly."]}`

  const ai = await callAI(prompt, 700)
  if (!ai) return res.status(503).json({ error: 'AI unavailable. Check API keys in Vercel.' })

  const cleaned = ai.text.replace(/\$/g, '')
  const data = parseJSON(cleaned)
  if (!data?.flights) return res.json({ raw: ai.text, parseError: true, provider: ai.provider })
  return res.json({ ...data, provider: ai.provider })
}
