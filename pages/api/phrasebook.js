// pages/api/phrasebook.js
import { callAI } from '../../lib/ai'

const PROMPT = (dest, country) =>
  `You are a travel language coach for ${dest}, ${country}.

Return ONLY this JSON with no extra text, no markdown backticks:
{
  "language": "German",
  "script": "Latin",
  "phrases": [
    { "category": "Greeting", "english": "Hello", "local": "Hallo", "pronunciation": "HAH-loh", "emoji": "👋" },
    { "category": "Farewell", "english": "Goodbye", "local": "Auf Wiedersehen", "pronunciation": "owf VEE-der-zayn", "emoji": "👋" },
    { "category": "Thanks", "english": "Thank you", "local": "Danke", "pronunciation": "DAHN-keh", "emoji": "🙏" },
    { "category": "Please", "english": "Please", "local": "Bitte", "pronunciation": "BIT-teh", "emoji": "🤲" },
    { "category": "Sorry", "english": "Sorry / Excuse me", "local": "Entschuldigung", "pronunciation": "ent-SHOOL-di-goong", "emoji": "😊" },
    { "category": "Help", "english": "Help!", "local": "Hilfe!", "pronunciation": "HIL-feh", "emoji": "🆘" },
    { "category": "Price", "english": "How much does this cost?", "local": "Wie viel kostet das?", "pronunciation": "vee FEEL KOS-tet dahs", "emoji": "💰" },
    { "category": "Bathroom", "english": "Where is the bathroom?", "local": "Wo ist die Toilette?", "pronunciation": "voh ist dee toi-LET-teh", "emoji": "🚻" },
    { "category": "Language", "english": "I don't understand", "local": "Ich verstehe nicht", "pronunciation": "ikh fer-SHTAY-eh nikht", "emoji": "😕" },
    { "category": "Language", "english": "Do you speak English?", "local": "Sprechen Sie Englisch?", "pronunciation": "SHPREK-en zee ENG-lish", "emoji": "🇬🇧" },
    { "category": "Food", "english": "This is delicious!", "local": "Das ist köstlich!", "pronunciation": "dahs ist KURST-likh", "emoji": "😋" },
    { "category": "Food", "english": "One coffee, please", "local": "Einen Kaffee, bitte", "pronunciation": "EYE-nen kah-FAY BIT-teh", "emoji": "☕" }
  ],
  "culturalTips": [
    "Punctuality is highly valued — arrive on time for any appointment",
    "Tipping is appreciated but not mandatory — round up the bill or add 10 percent",
    "Greet shopkeepers when you enter and leave a store — it is considered polite"
  ],
  "emergencyNumbers": {
    "police": "117",
    "ambulance": "144",
    "fire": "118"
  }
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const aiResult = await callAI(PROMPT(destName, destCountry || ''))
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable' })

  let cleaned = aiResult.text.replace(/```json/g, '').replace(/```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return res.status(422).json({ error: 'Could not parse phrase data', raw: aiResult.text })

  try {
    const data = JSON.parse(match[0])
    res.json({ ...data, provider: aiResult.provider })
  } catch (e) {
    res.status(422).json({ error: 'JSON parse failed', raw: aiResult.text })
  }
}
