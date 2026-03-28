// pages/api/dexfacts.js
import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const prompt = `Generate fascinating facts about ${destName}, ${destCountry || ''}.

Return this exact JSON structure:
{
  "story": "A compelling 2 to 3 sentence historical or legendary story about this place.",
  "fact": "One surprising scientific or geographical fact most people do not know.",
  "bestTime": "Best months to visit and why in one sentence.",
  "cuisine": "Name and one sentence description of the most famous local dish.",
  "hiddenGem": "One thing most tourists completely miss but absolutely should not.",
  "localWord": "One word or short phrase in the local language with its meaning and why it captures this place."
}`

  const aiResult = await callAI(prompt, 900)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable' })

  const data = parseJSON(aiResult.text)
  if (!data) return res.status(422).json({ error: 'Could not parse facts', raw: aiResult.text.slice(0, 300) })

  return res.json({ ...data, provider: aiResult.provider })
}
