// pages/api/planner.js — Game-first planner API
import { callAI } from '../../lib/ai'

export const PHASES = [
  { id: 1, name: 'Discover', emoji: '🔍', color: '#E8924A', levels: [1,2,3,4],     unlockWeeks: 999 },
  { id: 2, name: 'Prepare',  emoji: '🎒', color: '#5BC8FF', levels: [5,6,7,8,9],   unlockWeeks: 12  },
  { id: 3, name: 'Speak',    emoji: '💬', color: '#58E87A', levels: [10,11,12,13], unlockWeeks: 8   },
  { id: 4, name: 'Taste',    emoji: '🍽', color: '#FF85C0', levels: [14,15,16,17], unlockWeeks: 4   },
  { id: 5, name: 'Arrive',   emoji: '🛬', color: '#B0D8FF', levels: [18,19,20],    unlockWeeks: 1   },
]

export const LEVEL_META = {
  1:  { title: 'Who Are You Here?',   emoji: '🧭', phase: 1, game: 'quiz',      xp: 80,  desc: 'Discover your travel archetype' },
  2:  { title: 'Fact or Fiction',      emoji: '⚡', phase: 1, game: 'truefalse', xp: 60,  desc: '10 wild truths and myths' },
  3:  { title: 'Neighbourhood Match',  emoji: '🗺️', phase: 1, game: 'match',    xp: 70,  desc: 'Map the areas like a local' },
  4:  { title: 'Iconic Experiences',   emoji: '📸', phase: 1, game: 'quiz',      xp: 60,  desc: 'What makes this place unforgettable' },
  5:  { title: 'Visa & Entry',         emoji: '🛂', phase: 2, game: 'quiz',      xp: 80,  desc: 'Know before you go' },
  6:  { title: 'Health & Safety',      emoji: '🏥', phase: 2, game: 'truefalse', xp: 70,  desc: 'Stay safe and prepared' },
  7:  { title: 'Packing Challenge',    emoji: '🧳', phase: 2, game: 'fillblank', xp: 80,  desc: 'Pack smart for this trip' },
  8:  { title: 'Money Mastery',        emoji: '💳', phase: 2, game: 'quiz',      xp: 70,  desc: 'Cash, cards and tipping' },
  9:  { title: 'Getting Around',       emoji: '🚌', phase: 2, game: 'match',     xp: 60,  desc: 'Transport like a local' },
  10: { title: 'Phrase Bootcamp',      emoji: '🗣️', phase: 3, game: 'flashcard', xp: 100, desc: '12 essential phrases' },
  11: { title: 'Order Like a Local',   emoji: '🍜', phase: 3, game: 'flashcard', xp: 80,  desc: 'Food and restaurant language' },
  12: { title: 'Emergency Phrases',    emoji: '🆘', phase: 3, game: 'flashcard', xp: 90,  desc: 'Phrases that could save you' },
  13: { title: 'Culture Quiz',         emoji: '🙏', phase: 3, game: 'quiz',      xp: 80,  desc: 'Dos, donts and taboos' },
  14: { title: 'Dish Detective',       emoji: '🍽', phase: 4, game: 'match',     xp: 80,  desc: 'Match dishes to their stories' },
  15: { title: 'Market Savvy',         emoji: '🏪', phase: 4, game: 'quiz',      xp: 70,  desc: 'Street food and bargaining' },
  16: { title: 'Drink Culture',        emoji: '☕', phase: 4, game: 'truefalse', xp: 60,  desc: 'Coffee, tea and local drinks' },
  17: { title: 'Recipe Challenge',     emoji: '👨‍🍳', phase: 4, game: 'fillblank', xp: 100, desc: 'Learn to cook one iconic dish' },
  18: { title: 'Day 1 Playbook',       emoji: '✈️', phase: 5, game: 'quiz',      xp: 90,  desc: 'Master your first 24 hours' },
  19: { title: 'Hidden Gems Hunt',     emoji: '💎', phase: 5, game: 'match',     xp: 80,  desc: 'Find what tourists miss' },
  20: { title: 'Mindset & Mantra',     emoji: '🌿', phase: 5, game: 'quiz',      xp: 100, desc: 'Arrive with the right spirit' },
}

const PROMPTS = {
  1: (dest, country) => `Generate a travel personality quiz for ${dest}, ${country}. 6 multiple-choice questions that reveal what kind of traveller someone will be in ${dest}. Only ONE correct answer per question — it reveals a TRUE interesting fact about ${dest}.
Return ONLY JSON: {"archetype":"The Temple Wanderer","archetypeDesc":"2 sentences about this travel style in ${dest}","questions":[{"q":"question","options":["A","B","C","D"],"correct":0,"fact":"interesting true fact about ${dest} revealed by this answer"}]}`,

  2: (dest, country) => `Generate exactly 10 True/False statements about ${dest}, ${country}. 5 true, 5 false, mixed. Make them genuinely surprising — not obvious.
Return ONLY JSON: {"statements":[{"statement":"claim about ${dest}","answer":true,"explanation":"why true/false with colour and context","emoji":"🌊"}]}`,

  3: (dest, country) => `Generate a neighbourhood matching game for ${dest}, ${country}. 6 real areas with punchy vibe descriptions max 8 words each.
Return ONLY JSON: {"intro":"one sentence why knowing areas transforms the trip","pairs":[{"area":"neighbourhood name","vibe":"Ancient temples, lantern light, zero tourists","fact":"interesting fact revealed after matching"}]}`,

  4: (dest, country) => `Generate 8 quiz questions about iconic experiences in ${dest}, ${country}. Build excitement — make someone WANT to visit.
Return ONLY JSON: {"questions":[{"q":"evocative question about an experience in ${dest}","options":["A","B","C","D"],"correct":0,"revelation":"full story behind this experience — why extraordinary"}]}`,

  5: (dest, country) => `Generate 8 visa and entry quiz questions for ${dest}, ${country}. Specific, accurate, plausible wrong answers.
Return ONLY JSON: {"questions":[{"q":"visa or entry question","options":["A","B","C","D"],"correct":0,"explanation":"why correct and what to actually do"}]}`,

  6: (dest, country) => `Generate 10 health and safety True/False statements for ${dest}, ${country}. Mix facts with common misconceptions.
Return ONLY JSON: {"statements":[{"statement":"health or safety claim","answer":true,"explanation":"practical advice","emoji":"💊"}]}`,

  7: (dest, country, travelDate, days) => `Generate 8 packing fill-in-the-blank questions for ${dest}, ${country} in ${travelDate} for ${days} days. Each sentence has one blank, 3 word options.
Return ONLY JSON: {"intro":"packing philosophy for this trip","questions":[{"sentence":"For ${dest}, always pack ___ because the humidity is extreme.","blank":"the missing word","options":["correct answer","wrong 1","wrong 2"],"correct":0,"tip":"practical tip explaining why"}]}`,

  8: (dest, country) => `Generate 8 money and payments quiz questions for ${dest}, ${country}. Currency, tipping, bargaining, card use.
Return ONLY JSON: {"questions":[{"q":"money question for ${dest}","options":["A","B","C","D"],"correct":0,"explanation":"practical money advice"}]}`,

  9: (dest, country) => `Generate a transport matching game for ${dest}, ${country}. 6 pairs of transport mode matched to cost, timing, or use case — max 10 words per vibe.
Return ONLY JSON: {"pairs":[{"area":"transport mode","vibe":"cost and when to use it — 8 words max","fact":"insider transport tip revealed after matching"}]}`,

  10: (dest, country) => `Generate 12 essential travel flashcards for ${dest}, ${country}.
Return ONLY JSON: {"language":"language name","script":"Latin","cards":[{"front":"Hello","back":"local word","pronunciation":"phonetic heh-LOH","category":"greeting","emoji":"👋","memoryHook":"memory trick"}]}
Include: hello, goodbye, please, thank you, sorry, yes, no, how much, bathroom, help, I don't understand, do you speak English`,

  11: (dest, country) => `Generate 10 food and restaurant flashcards for ${dest}, ${country}. Ordering, dietary needs, compliments, bill.
Return ONLY JSON: {"cards":[{"front":"English phrase","back":"local language","pronunciation":"phonetic","category":"ordering","emoji":"🍽","memoryHook":"trick"}]}`,

  12: (dest, country) => `Generate 10 emergency flashcards for ${dest}, ${country}. Police, medical, lost, theft.
Return ONLY JSON: {"emergencyNumbers":{"police":"number","ambulance":"number"},"cards":[{"front":"English phrase","back":"local language","pronunciation":"phonetic","category":"emergency","emoji":"🆘","memoryHook":"trick"}]}`,

  13: (dest, country) => `Generate 8 cultural etiquette scenario quiz questions for ${dest}, ${country}. Scenario-based, wrong answers are common Western assumptions.
Return ONLY JSON: {"questions":[{"q":"You are invited to a local home in ${dest}. You should...","options":["A","B","C","D"],"correct":0,"explanation":"cultural reasoning"}]}`,

  14: (dest, country) => `Generate a dish-matching game for ${dest}, ${country}. 6 pairs: dish name matched to its defining characteristic.
Return ONLY JSON: {"pairs":[{"area":"🍜 Dish Name","vibe":"its defining characteristic in 6-8 words","fact":"the story or secret behind this dish"}]}`,

  15: (dest, country) => `Generate 8 market and street food quiz questions for ${dest}, ${country}.
Return ONLY JSON: {"questions":[{"q":"market or street food question","options":["A","B","C","D"],"correct":0,"explanation":"practical food advice"}]}`,

  16: (dest, country) => `Generate 10 drink culture True/False statements for ${dest}, ${country}. Coffee, alcohol, tea, toasting customs.
Return ONLY JSON: {"statements":[{"statement":"drink culture claim","answer":true,"explanation":"context and advice","emoji":"☕"}]}`,

  17: (dest, country) => `Generate 8 recipe fill-in-the-blank questions for the most iconic dish of ${dest}, ${country}. Ingredients, techniques, cultural notes.
Return ONLY JSON: {"dish":"dish name","emoji":"🍜","story":"one sentence cultural significance","questions":[{"sentence":"The ___ is added last to preserve its bright colour.","blank":"missing word","options":["correct","wrong 1","wrong 2"],"correct":0,"tip":"cooking insight"}]}`,

  18: (dest, country, travelDate, homecity, days) => `Generate 8 Day 1 quiz questions for ${dest}, ${country} for a traveller from ${homecity} for ${days} days.
Return ONLY JSON: {"questions":[{"q":"Day 1 decision question","options":["A","B","C","D"],"correct":0,"explanation":"local knowledge behind this answer"}]}`,

  19: (dest, country) => `Generate a hidden gems matching game for ${dest}, ${country}. 6 lesser-known places matched to what makes them special.
Return ONLY JSON: {"pairs":[{"area":"hidden gem name","vibe":"what makes it special in 7-8 words","fact":"why it is worth seeking out"}]}`,

  20: (dest, country) => `Generate 8 mindset and travel philosophy quiz questions for ${dest}, ${country}. Thoughtful — about pace, attitude, presence. Feel wise not trivial.
Return ONLY JSON: {"mantra":"5-7 word travel mantra for ${dest}","questions":[{"q":"thoughtful question about being present in ${dest}","options":["A","B","C","D"],"correct":0,"wisdom":"genuine travel insight 1-2 sentences"}]}`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { level, dest, country, travelDate, homecity, days } = req.body
  if (!level || !dest) return res.status(400).json({ error: 'level and dest required' })
  const promptFn = PROMPTS[level]
  if (!promptFn) return res.status(400).json({ error: `Unknown level: ${level}` })
  const prompt = promptFn(dest, country||'', travelDate||'your travel month', homecity||'your city', days||7)
  const aiResult = await callAI(prompt)
  if (!aiResult) return res.status(503).json({ error: 'AI unavailable' })
  let cleaned = aiResult.text.replace(/```json/g,'').replace(/```/g,'').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return res.status(422).json({ error: 'Parse failed', raw: aiResult.text })
  try {
    const data = JSON.parse(match[0])
    return res.json({ data, level, provider: aiResult.provider })
  } catch(e) {
    return res.status(422).json({ error: 'JSON error', raw: aiResult.text })
  }
}
