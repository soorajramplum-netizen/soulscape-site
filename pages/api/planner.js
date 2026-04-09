// pages/api/planner.js
import { callAI, parseJSON } from '../../lib/ai'

export const LEVEL_META = [
  { level: 1, theme: 'Geography & Basecamp',    emoji: '🗺️',  xp: 100, desc: 'Orientation, neighbourhoods, where to stay' },
  { level: 2, theme: 'Transit Mastery',          emoji: '🚌', xp: 100, desc: 'Buses, trains, ferries, taxis, tickets' },
  { level: 3, theme: 'Language Mega-Level',       emoji: '💬', xp: 300, desc: 'Greetings · Food · Navigation — 30 questions' },
  { level: 4, theme: 'Local Etiquette & Culture', emoji: '🙏', xp: 100, desc: 'Dress codes, faux pas, cultural rules' },
  { level: 5, theme: 'Culinary Survival',         emoji: '🍽', xp: 100, desc: 'Meal times, ordering, table charges' },
  { level: 6, theme: 'Money & Scams',             emoji: '💰', xp: 100, desc: 'ATMs, currency, tourist traps' },
  { level: 7, theme: 'Itinerary & Optimisation',  emoji: '📅', xp: 100, desc: 'Crowds, timing, booking windows' },
  { level: 8, theme: 'Packing Puzzle',            emoji: '🧳', xp: 100, desc: 'Weather, plugs, terrain-specific gear' },
  { level: 9, theme: 'Touchdown Protocol',        emoji: '✈️',  xp: 100, desc: 'Airport to city, first 24 hours' },
]

function buildPrompt(dest, country, language, travelMonth, homecity) {
  return `You are creating a pre-trip gamified course for someone travelling to ${dest}, ${country} in ${travelMonth}${homecity ? `, from ${homecity}` : ''}.

ABSOLUTE RULE: Every question must be specific to ${dest}. Use real place names, real transport systems, real prices, real dish names, real cultural facts. Generic questions are not allowed.

MECHANICS:
- swipe: left=bad idea, right=good idea. correct_answer is "left" or "right"
- scenario: multiple choice. correct_answer is a string. options is array of exactly 3 strings
- speed_tf: true/false. correct_answer is "true" or "false"
- matching: match pairs. correct_answer is object with exactly 3 key-value string pairs
- sequence: correct order. correct_answer is array of 3-4 strings
- slider: number/time/price guess. correct_answer is string like "8:30 PM" or "€2.40" or "28°C"
- visual_tap: tap correct item. correct_answer is a string. options is array of exactly 4 strings

Generate exactly 9 levels. Use all 7 mechanics across every level.

LEVEL THEMES AND WHAT TO COVER:

Level 1 — Geography (10 Qs): Name real areas/neighbourhoods of ${dest}. Terrain, elevation. Which area for which type of traveller. Distances between key spots.

Level 2 — Transit (10 Qs): The actual transit system name in ${dest}. Real ticket prices in local currency. How to buy tickets. Common tourist mistakes on transport in ${dest}.

Level 3 — Language (30 Qs, 10 per group):
  Greetings (10): ${language} greetings, politeness levels, gestures in ${country}
  Food (10): Real dish names from ${dest}, ordering phrases, dietary restriction phrases
  Navigation (10): Real words on signs, menus, doors in ${language}. What Chiuso/Fermé/Kapalı etc mean.

Level 4 — Etiquette (10 Qs): Dress codes for specific sites in ${dest}. Tipping norms with real percentages. Real cultural faux pas tourists make in ${country}.

Level 5 — Culinary (10 Qs): Actual local dishes of ${dest}. Real meal times in ${country}. Cover charges or service charges in ${dest}. Food market names.

Level 6 — Money (10 Qs): Currency of ${country}. Real ATM advice for ${dest}. Specific scams that target tourists in ${dest} by name. Real coffee/meal/taxi price ranges.

Level 7 — Itinerary (10 Qs): Real attractions in ${dest} with opening times or crowds advice. Best time of day for specific places. How far ahead to book popular things. Weather in ${travelMonth}.

Level 8 — Packing (10 Qs): Actual temperature in ${dest} in ${travelMonth}. Plug socket type in ${country}. Terrain (cobblestones? sand? altitude?). What to leave home.

Level 9 — Touchdown (10 Qs): Actual airport or entry point for ${dest} with IATA code. Real transport from airport to ${dest} with prices. First practical steps on arrival.

FEEDBACK RULE: feedback_text must teach something real and specific about ${dest}. Not "Correct!" but an actual fact. Example: "The SITA bus from Amalfi to Positano costs €2.40 and tickets must be bought at a Tabacchi shop — drivers do not sell tickets."

Return ONLY this JSON with no extra text:
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
          "prompt": "Question text here",
          "correct_answer": "left",
          "options": null,
          "feedback_text": "Teaching text here"
        }
      ]
    }
  ]
}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { dest, country, language, travelMonth, homecity } = req.body
  if (!dest || !travelMonth) return res.status(400).json({ error: 'dest and travelMonth required' })

  const prompt = buildPrompt(dest, country || '', language || 'English', travelMonth, homecity || '')
  const aiResult = await callAI(prompt, 4000)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable. Check API keys.' })

  const data = parseJSON(aiResult.text)
  if (!data?.levels?.length) {
    return res.status(422).json({ error: 'Could not generate course. Try again.', raw: aiResult.text?.slice(0, 200) })
  }

  return res.json({ ...data, provider: aiResult.provider })
}
