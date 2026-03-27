// pages/api/cuisine.js
import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country) =>
  `You are a culinary guide. Return JSON for the most iconic dish of ${dest}, ${country}.
No markdown, no backticks, no dollar signs. Valid JSON only.

{
  "dish": "dish name",
  "emoji": "food emoji",
  "description": "Two sentences: what it is and why it defines this place.",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4", "ingredient 5"],
  "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "tags": ["tag1", "tag2", "tag3"],
  "alsoTry": ["another local dish", "a local drink"],
  "dietaryNotes": "vegetarian/vegan/halal/gluten note"
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''), 800)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable — check API keys in Vercel' })

  const data = parseJSON(aiResult.text)
  if (!data) {
    // Return raw text so UI can show something
    return res.json({ dish: destName + ' Cuisine', emoji: '🍽', description: aiResult.text, ingredients: [], steps: [], tags: [], alsoTry: [], dietaryNotes: '', provider: aiResult.provider })
  }
  res.json({ ...data, provider: aiResult.provider })
}
