// pages/api/planner.js — 8-level Pre-Trip Planner
// Each level generates a small, reliable JSON game payload
import { callAI, parseJSON } from '../../lib/ai'

export const PHASES = [
  { id: 1, name: 'Discover', emoji: '🔍', color: '#E8924A', levels: [1,2],   unlockWeeks: 999 },
  { id: 2, name: 'Prepare',  emoji: '🎒', color: '#5BC8FF', levels: [3,4],   unlockWeeks: 12  },
  { id: 3, name: 'Speak',    emoji: '💬', color: '#58E87A', levels: [5,6],   unlockWeeks: 8   },
  { id: 4, name: 'Arrive',   emoji: '🛬', color: '#B0D8FF', levels: [7,8],   unlockWeeks: 1   },
]

export const LEVEL_META = {
  1: { title: 'Fact or Fiction',     emoji: '⚡', phase: 1, game: 'truefalse', xp: 80,  desc: '8 wild truths and myths about this place' },
  2: { title: 'Know Your Destination', emoji: '🧭', phase: 1, game: 'quiz',    xp: 80,  desc: '6 questions that reveal what to expect' },
  3: { title: 'Visa and Money',       emoji: '🛂', phase: 2, game: 'quiz',    xp: 70,  desc: 'Entry rules, currency, and tipping' },
  4: { title: 'Packing Challenge',    emoji: '🧳', phase: 2, game: 'fillblank',xp: 80,  desc: 'Pack smart for this specific trip' },
  5: { title: 'Phrase Bootcamp',      emoji: '🗣️', phase: 3, game: 'flashcard',xp: 100, desc: '8 essential phrases with pronunciation' },
  6: { title: 'Culture Rules',        emoji: '🙏', phase: 3, game: 'truefalse',xp: 70,  desc: 'Dos, donts and cultural surprises' },
  7: { title: 'Dish Detective',       emoji: '🍽', phase: 4, game: 'quiz',    xp: 70,  desc: '6 questions about local food culture' },
  8: { title: 'Day 1 Playbook',       emoji: '🗺️', phase: 4, game: 'quiz',    xp: 90,  desc: 'Nail your first 24 hours' },
}

// Each prompt is tight — asks for small JSON that reliably parses
const PROMPTS = {

  1: (dest) => `Create 8 True or False statements about ${dest}. Make 4 true and 4 false, mixed randomly. Use genuinely surprising facts.
Reply with this JSON and nothing else:
{"statements":[{"statement":"Claim about ${dest}.","answer":true,"explanation":"Why true with interesting context.","emoji":"🌊"},{"statement":"Believable myth.","answer":false,"explanation":"Why false and what the truth is.","emoji":"❌"}]}
Include exactly 8 statements total.`,

  2: (dest) => `Create 6 multiple-choice questions about ${dest} that reveal what a first-time visitor needs to know.
Reply with this JSON and nothing else:
{"questions":[{"q":"Question about ${dest}?","options":["Option A","Option B","Option C","Option D"],"correct":0,"fact":"Interesting fact revealed by the correct answer."}]}
Include exactly 6 questions.`,

  3: (dest, country) => `Create 6 quiz questions about visa requirements, currency, and tipping in ${dest}${country ? ', ' + country : ''}.
Reply with this JSON and nothing else:
{"questions":[{"q":"Practical question about entering or paying in ${dest}?","options":["Option A","Option B","Option C","Option D"],"correct":0,"explanation":"Practical advice for travellers."}]}
Include exactly 6 questions.`,

  4: (dest, travelDate) => `Create 6 fill-in-the-blank packing questions for ${dest} in ${travelDate}.
Each sentence has one blank marked ___ with 3 word options.
Reply with this JSON and nothing else:
{"intro":"One sentence on packing philosophy for this trip.","questions":[{"sentence":"For ${dest} in ${travelDate}, pack ___ to deal with the heat.","blank":"correct answer","options":["correct answer","wrong option","wrong option"],"correct":0,"tip":"Why this matters for this specific destination."}]}
Include exactly 6 questions.`,

  5: (dest, country) => `Give 8 essential travel phrases for ${dest}${country ? ', ' + country : ''}.
Reply with this JSON and nothing else:
{"language":"Language name","cards":[{"front":"Hello","back":"local word","pronunciation":"phonetic","emoji":"👋","memoryHook":"Memory trick."},{"front":"Thank you","back":"local word","pronunciation":"phonetic","emoji":"🙏","memoryHook":"Memory trick."},{"front":"How much?","back":"local phrase","pronunciation":"phonetic","emoji":"💰","memoryHook":"Memory trick."},{"front":"Where is the bathroom?","back":"local phrase","pronunciation":"phonetic","emoji":"🚻","memoryHook":"Memory trick."},{"front":"Help!","back":"local word","pronunciation":"phonetic","emoji":"🆘","memoryHook":"Memory trick."},{"front":"I do not understand","back":"local phrase","pronunciation":"phonetic","emoji":"😕","memoryHook":"Memory trick."},{"front":"Delicious!","back":"local word","pronunciation":"phonetic","emoji":"😋","memoryHook":"Memory trick."},{"front":"Goodbye","back":"local word","pronunciation":"phonetic","emoji":"👋","memoryHook":"Memory trick."}]}
Replace all placeholder text with real values for ${dest}.`,

  6: (dest, country) => `Create 8 True or False statements about cultural rules and etiquette in ${dest}${country ? ', ' + country : ''}. Mix surprising truths with common Western misconceptions.
Reply with this JSON and nothing else:
{"statements":[{"statement":"Cultural claim about ${dest}.","answer":true,"explanation":"Why with cultural reasoning.","emoji":"🙏"}]}
Include exactly 8 statements, mix of true and false.`,

  7: (dest, country) => `Create 6 quiz questions about food culture and iconic dishes of ${dest}${country ? ', ' + country : ''}.
Reply with this JSON and nothing else:
{"questions":[{"q":"Food question about ${dest}?","options":["Option A","Option B","Option C","Option D"],"correct":0,"explanation":"Food knowledge about this destination."}]}
Include exactly 6 questions.`,

  8: (dest, country, homecity) => `Create 6 quiz questions about the first 24 hours in ${dest}${country ? ', ' + country : ''} for a traveller from ${homecity || 'abroad'}.
Cover: airport transport, SIM card, first meal, what to do first, what to avoid.
Reply with this JSON and nothing else:
{"questions":[{"q":"Day 1 question for ${dest}?","options":["Option A","Option B","Option C","Option D"],"correct":0,"explanation":"Local knowledge behind this answer."}]}
Include exactly 6 questions.`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { level, dest, country, travelDate, homecity } = req.body
  if (!level || !dest) return res.status(400).json({ error: 'level and dest required' })

  const n = parseInt(level)
  const fn = PROMPTS[n]
  if (!fn) return res.status(400).json({ error: `Unknown level: ${level}` })

  const prompt = fn(dest, country || '', travelDate || 'your travel month', homecity || 'your city')
  const ai = await callAI(prompt, 1200)

  if (!ai) return res.status(503).json({
    error: 'AI unavailable. Make sure GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY is set in Vercel.'
  })

  const data = parseJSON(ai.text)
  if (!data) {
    return res.status(422).json({
      error: 'Parse failed',
      _raw: ai.text?.slice(0, 300),
      provider: ai.provider
    })
  }

  return res.json({ data, level: n, provider: ai.provider })
}
