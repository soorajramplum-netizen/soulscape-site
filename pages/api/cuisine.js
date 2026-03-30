import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const prompt = `What is the most iconic local dish of ${destName}${destCountry ? ', ' + destCountry : ''}?

Reply with this JSON object and nothing else:
{"dish":"DISH_NAME","emoji":"FOOD_EMOJI","description":"Two sentences about what this dish is and why locals love it.","ingredients":["item1","item2","item3","item4","item5"],"steps":["Step 1 instruction.","Step 2 instruction.","Step 3 instruction.","Step 4 instruction.","Step 5 instruction."],"tags":["Tag1","Tag2","Tag3"],"alsoTry":["Another local dish","A local drink"],"dietaryNotes":"Vegetarian/vegan/halal/gluten note."}`

  const ai = await callAI(prompt, 1000)
  if (!ai) return res.status(503).json({ error: 'AI unavailable. Check API keys in Vercel.' })

  const data = parseJSON(ai.text)
  if (!data?.dish) {
    return res.json({ dish: destName + ' Cuisine', emoji: '🍽', description: 'Try again — AI response could not be parsed.', ingredients: [], steps: [], tags: [], alsoTry: [], dietaryNotes: '', _retry: true, provider: ai.provider })
  }
  return res.json({ ...data, provider: ai.provider })
}
