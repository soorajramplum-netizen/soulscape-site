// pages/api/cuisine.js
import { callAI } from '../../lib/ai'

const PROMPT = (dest, country) =>
  `You are a culinary travel guide. Give the most iconic dish for ${dest}, ${country}.

Return ONLY this JSON with no extra text, no dollar signs, no markdown:
{
  "dish": "Fondue",
  "emoji": "🫕",
  "description": "Two sentences about what this dish is and why it matters to this place.",
  "ingredients": ["Gruyere cheese", "Emmental cheese", "white wine", "garlic", "cornstarch", "bread"],
  "steps": [
    "Rub the fondue pot with a cut garlic clove",
    "Add wine and heat gently until simmering",
    "Add grated cheese gradually, stirring constantly",
    "Mix cornstarch with kirsch and stir in",
    "Serve immediately with bread cubes for dipping"
  ],
  "tags": ["Cheese", "Sharing", "Alpine"],
  "alsoTry": ["Raclette", "Rosti with fried egg"],
  "dietaryNotes": "Contains dairy and gluten. Vegetarian-friendly."
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''))
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable' })

  let cleaned = aiResult.text.replace(/```json/g, '').replace(/```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return res.status(422).json({ error: 'Could not parse cuisine data', raw: aiResult.text })

  try {
    const data = JSON.parse(match[0])
    res.json({ ...data, provider: aiResult.provider })
  } catch (e) {
    res.status(422).json({ error: 'JSON parse failed', raw: aiResult.text })
  }
}
