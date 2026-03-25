// pages/api/dexfacts.js
import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country) => `You are a travel encyclopaedia. Generate fascinating facts about ${dest}, ${country}.

Return ONLY valid JSON:
{
  "story": "A compelling 2-3 sentence historical or legendary story about this place",
  "fact": "One surprising scientific or geographical fact",
  "bestTime": "Best months to visit and why",
  "cuisine": "Name of the most famous local dish",
  "hiddenGem": "One thing most tourists miss but shouldn't",
  "localWord": "One word or phrase in the local language that captures the spirit of this place, with its meaning"
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''))
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable' })

  const data = parseJSON(aiResult.text)
  if (!data) return res.status(422).json({ error: 'Could not parse facts' })

  res.json({ ...data, provider: aiResult.provider })
}
