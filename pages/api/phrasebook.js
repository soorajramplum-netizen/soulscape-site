// pages/api/phrasebook.js
// Returns essential travel phrases for a destination's language
// Powered by AI — no hardcoded datasets needed

import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country) => `You are a travel language coach. Generate essential phrases for a tourist visiting ${dest}, ${country}.

Return ONLY valid JSON:
{
  "language": "name of primary language spoken",
  "script": "Latin / Arabic / Cyrillic / etc",
  "phrases": [
    {
      "category": "Greeting",
      "english": "Hello",
      "local": "local language text",
      "pronunciation": "phonetic English pronunciation like heh-LOH",
      "emoji": "relevant emoji"
    }
  ],
  "culturalTips": [
    "one key cultural do",
    "one key cultural don't",
    "one surprising etiquette fact"
  ],
  "emergencyNumbers": {
    "police": "number",
    "ambulance": "number",
    "fire": "number"
  }
}

Include exactly 12 phrases covering: greeting, goodbye, thank you, please, sorry, help, how much, where is the bathroom, I don't understand, can you speak English, delicious (for food), one beer/coffee please.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''))

  if (!aiResult) {
    return res.status(503).json({ error: 'AI unavailable' })
  }

  const data = parseJSON(aiResult.text)
  if (!data) {
    return res.status(422).json({ error: 'Could not parse phrase data' })
  }

  res.json({ ...data, provider: aiResult.provider })
}
