// pages/api/phrasebook.js
import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const prompt = `Generate 12 essential travel phrases for a tourist visiting ${destName}, ${destCountry || ''}.

Return this exact JSON structure:
{
  "language": "Primary language spoken there",
  "script": "Latin or Arabic or Cyrillic or Japanese etc",
  "phrases": [
    { "category": "Greeting", "english": "Hello", "local": "local word here", "pronunciation": "phonetic spelling", "emoji": "👋" },
    { "category": "Farewell", "english": "Goodbye", "local": "local word", "pronunciation": "phonetic", "emoji": "👋" },
    { "category": "Thanks", "english": "Thank you", "local": "local word", "pronunciation": "phonetic", "emoji": "🙏" },
    { "category": "Please", "english": "Please", "local": "local word", "pronunciation": "phonetic", "emoji": "🤲" },
    { "category": "Sorry", "english": "Sorry", "local": "local word", "pronunciation": "phonetic", "emoji": "😊" },
    { "category": "Help", "english": "Help!", "local": "local word", "pronunciation": "phonetic", "emoji": "🆘" },
    { "category": "Price", "english": "How much?", "local": "local phrase", "pronunciation": "phonetic", "emoji": "💰" },
    { "category": "Bathroom", "english": "Where is the bathroom?", "local": "local phrase", "pronunciation": "phonetic", "emoji": "🚻" },
    { "category": "Language", "english": "I do not understand", "local": "local phrase", "pronunciation": "phonetic", "emoji": "😕" },
    { "category": "Language", "english": "Do you speak English?", "local": "local phrase", "pronunciation": "phonetic", "emoji": "🇬🇧" },
    { "category": "Food", "english": "This is delicious!", "local": "local phrase", "pronunciation": "phonetic", "emoji": "😋" },
    { "category": "Food", "english": "One coffee please", "local": "local phrase", "pronunciation": "phonetic", "emoji": "☕" }
  ],
  "culturalTips": ["Cultural tip one", "Cultural tip two", "Cultural tip three"],
  "emergencyNumbers": { "police": "number", "ambulance": "number", "fire": "number" }
}`

  const aiResult = await callAI(prompt, 1800)
  if (!aiResult) {
    return res.status(503).json({ error: 'AI unavailable — check your API keys in Vercel environment variables' })
  }

  const data = parseJSON(aiResult.text)

  if (!data || !data.phrases) {
    return res.status(422).json({
      error: 'Could not parse phrase data. Please try again.',
      _raw: aiResult.text.slice(0, 200),
    })
  }

  return res.json({ ...data, provider: aiResult.provider })
}
