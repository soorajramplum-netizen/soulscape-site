// pages/api/cuisine.js
import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const prompt = `Give the most iconic local dish of ${destName}, ${destCountry || ''}.

Return this exact JSON structure with real values substituted in:
{
  "dish": "Name of the dish",
  "emoji": "🍜",
  "description": "One to two sentences describing what the dish is and why it matters to this place.",
  "ingredients": ["ingredient one", "ingredient two", "ingredient three", "ingredient four", "ingredient five"],
  "steps": ["Step one instruction", "Step two instruction", "Step three instruction", "Step four instruction", "Step five instruction"],
  "tags": ["Tag1", "Tag2", "Tag3"],
  "alsoTry": ["Another local dish", "A local drink"],
  "dietaryNotes": "Note about vegetarian vegan halal gluten options"
}`

  const aiResult = await callAI(prompt, 1200)
  if (!aiResult) {
    return res.status(503).json({ error: 'AI unavailable — check your API keys in Vercel environment variables' })
  }

  const data = parseJSON(aiResult.text)

  if (!data || !data.dish) {
    // Graceful fallback — show something useful
    return res.json({
      dish: `${destName} Signature Dish`,
      emoji: '🍽',
      description: `${destName} has a rich culinary tradition. The AI response could not be parsed this time — please try again.`,
      ingredients: [],
      steps: [],
      tags: [],
      alsoTry: [],
      dietaryNotes: '',
      provider: aiResult.provider,
      _retryHint: true,
    })
  }

  return res.json({ ...data, provider: aiResult.provider })
}
