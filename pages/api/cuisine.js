// pages/api/cuisine.js
import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country) => `You are a culinary travel guide. Generate the signature dish and recipe for ${dest}, ${country}.

Return ONLY valid JSON:
{
  "dish": "name of the most iconic local dish",
  "emoji": "food emoji",
  "description": "2 sentences — what it is and why it matters to this place",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "tags": ["tag 1", "tag 2", "tag 3"],
  "alsoTry": ["another local dish", "another local drink or snack"],
  "dietaryNotes": "vegetarian/vegan/halal/etc availability note"
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''))
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable' })

  const data = parseJSON(aiResult.text)
  if (!data) return res.status(422).json({ error: 'Could not parse cuisine data' })

  res.json({ ...data, provider: aiResult.provider })
}
