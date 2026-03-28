import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const prompt = `Give fascinating facts about ${destName}${destCountry ? ', ' + destCountry : ''}.

Reply with this JSON object and nothing else:
{"story":"A compelling 2-sentence historical or legendary story about this place.","fact":"One surprising fact most people do not know.","bestTime":"Best months to visit and why.","cuisine":"Name and one-sentence description of the most famous local dish.","hiddenGem":"One thing most tourists miss but should not.","localWord":"One local word with its meaning that captures the spirit of this place."}`

  const ai = await callAI(prompt, 700)
  if (!ai) return res.status(503).json({ error: 'AI unavailable' })

  const data = parseJSON(ai.text)
  if (!data?.story) return res.status(422).json({ error: 'Could not parse facts. Try again.' })
  return res.json({ ...data, provider: ai.provider })
}
