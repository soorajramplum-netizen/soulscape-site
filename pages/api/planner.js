// pages/api/planner.js
// Generates 110-question destination-specific course using the gamification design
import { callAI, parseJSON } from '../../lib/ai'

export const LEVEL_META = [
  { level: 1, theme: 'Geography & Basecamp',   emoji: '🗺️',  xp: 100, desc: 'Orientation, neighbourhoods, where to stay' },
  { level: 2, theme: 'Transit Mastery',         emoji: '🚌', xp: 100, desc: 'Buses, trains, ferries, taxis, tickets' },
  { level: 3, theme: 'Language Mega-Level',      emoji: '💬', xp: 300, desc: 'Greetings · Food · Navigation — 30 questions' },
  { level: 4, theme: 'Local Etiquette',          emoji: '🙏', xp: 100, desc: 'Dress codes, faux pas, cultural rules' },
  { level: 5, theme: 'Culinary Survival',        emoji: '🍽', xp: 100, desc: 'Meal times, ordering, table charges' },
  { level: 6, theme: 'Money & Scams',            emoji: '💰', xp: 100, desc: 'ATMs, currency, tourist traps' },
  { level: 7, theme: 'Itinerary & Optimisation', emoji: '📅', xp: 100, desc: 'Crowds, timing, booking windows' },
  { level: 8, theme: 'Packing Puzzle',           emoji: '🧳', xp: 100, desc: 'Weather, plugs, terrain-specific gear' },
  { level: 9, theme: 'Touchdown Protocol',       emoji: '✈️',  xp: 100, desc: 'Airport to city, first 24 hours' },
]

const MECHANICS = ['swipe', 'visual_tap', 'slider', 'sequence', 'matching', 'scenario', 'speed_tf']

function buildPrompt(dest, country, language, travelMonth) {
  return `You are an expert travel gamification designer creating a Pre-Trip Course for "${dest}", ${country}.
Travel month: ${travelMonth}. Primary local language: ${language}.

Generate a JSON object with 9 levels, 110 questions total:
- Levels 1,2,4,5,6,7,8,9: exactly 10 questions each
- Level 3 (Language Mega-Level): exactly 30 questions (10 greetings, 10 food vocabulary, 10 navigation/signs)

MECHANICS — use all 7, varied across every level:
- swipe: user swipes RIGHT (good idea) or LEFT (bad idea). correct_answer is "right" or "left"
- visual_tap: user taps correct item in a described scene. correct_answer is the item to tap
- slider: user guesses a number/time/price. correct_answer is the target value as string e.g. "€2.40" or "8:00 PM"
- sequence: user orders 3-4 steps. correct_answer is array of items in correct order
- matching: user matches 3 pairs. correct_answer is object with key-value pairs e.g. {"Ferry":"€10-15","Bus":"€2-3"}
- scenario: multiple choice with 3 options. correct_answer is the correct option text
- speed_tf: rapid true or false. correct_answer is "true" or "false"

CRITICAL RULES:
- Every question MUST be specific to "${dest}" — real place names, real prices, real transport names
- Level 8 packing MUST reference ${travelMonth} weather specifically
- Level 9 MUST describe the actual airport and route from airport to ${dest}
- feedback_text MUST explain WHY — teach something real, not just "correct!"
- Wrong answer feedback must be educational, not punishing
- Prices in local currency

Return ONLY this JSON structure, nothing else:
{
  "destination": "${dest}",
  "country": "${country}",
  "language": "${language}",
  "travelMonth": "${travelMonth}",
  "levels": [
    {
      "level_number": 1,
      "theme": "Geography & Basecamp",
      "questions": [
        {
          "mechanic": "swipe",
          "prompt": "Your hotel website shows 187 steps from the road to reception.",
          "correct_answer": "right",
          "feedback_text": "Positano is built vertically into a cliff — steps are unavoidable. Pack light and embrace the workout."
        }
      ]
    }
  ]
}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { dest, country, language, travelMonth, tripId } = req.body
  if (!dest || !travelMonth) return res.status(400).json({ error: 'dest and travelMonth required' })

  const prompt = buildPrompt(dest, country || '', language || 'English', travelMonth)
  const aiResult = await callAI(prompt, 4000)

  if (!aiResult) return res.status(503).json({ error: 'AI unavailable. Check API keys.' })

  const data = parseJSON(aiResult.text)
  if (!data || !data.levels) {
    return res.status(422).json({ error: 'Could not generate course. Try again.', raw: aiResult.text.slice(0, 300) })
  }

  return res.json({ ...data, provider: aiResult.provider })
}
