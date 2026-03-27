// pages/api/phrasebook.js
import { callAI, parseJSON } from '../../lib/ai'

const PROMPT = (dest, country) =>
  `You are a travel language coach. Return JSON for essential phrases in ${dest}, ${country}.
No markdown, no backticks. Valid JSON only.

{
  "language": "language name",
  "script": "Latin or Arabic or Cyrillic etc",
  "phrases": [
    { "category": "Greeting", "english": "Hello", "local": "local text", "pronunciation": "phonetic", "emoji": "👋" },
    { "category": "Farewell", "english": "Goodbye", "local": "local text", "pronunciation": "phonetic", "emoji": "👋" },
    { "category": "Thanks", "english": "Thank you", "local": "local text", "pronunciation": "phonetic", "emoji": "🙏" },
    { "category": "Please", "english": "Please", "local": "local text", "pronunciation": "phonetic", "emoji": "🤲" },
    { "category": "Sorry", "english": "Sorry", "local": "local text", "pronunciation": "phonetic", "emoji": "😊" },
    { "category": "Help", "english": "Help!", "local": "local text", "pronunciation": "phonetic", "emoji": "🆘" },
    { "category": "Price", "english": "How much?", "local": "local text", "pronunciation": "phonetic", "emoji": "💰" },
    { "category": "Bathroom", "english": "Where is the bathroom?", "local": "local text", "pronunciation": "phonetic", "emoji": "🚻" },
    { "category": "Language", "english": "I do not understand", "local": "local text", "pronunciation": "phonetic", "emoji": "😕" },
    { "category": "Language", "english": "Do you speak English?", "local": "local text", "pronunciation": "phonetic", "emoji": "🇬🇧" },
    { "category": "Food", "english": "This is delicious!", "local": "local text", "pronunciation": "phonetic", "emoji": "😋" },
    { "category": "Food", "english": "One coffee please", "local": "local text", "pronunciation": "phonetic", "emoji": "☕" }
  ],
  "culturalTips": ["tip 1", "tip 2", "tip 3"],
  "emergencyNumbers": { "police": "number", "ambulance": "number", "fire": "number" }
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''), 1500)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable — check API keys in Vercel' })

  const data = parseJSON(aiResult.text)
  if (!data) return res.status(422).json({ error: 'Could not parse phrase data', raw: aiResult.text })

  res.json({ ...data, provider: aiResult.provider })
}
