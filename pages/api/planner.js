// pages/api/planner.js — Game-first planner API
import { callAI, parseJSON } from '../../lib/ai'

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
  5:  { title: 'Visa and Entry',       emoji: '🛂', phase: 2, game: 'quiz',      xp: 80,  desc: 'Know before you go' },
  6:  { title: 'Health and Safety',    emoji: '🏥', phase: 2, game: 'truefalse', xp: 70,  desc: 'Stay safe and prepared' },
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
  20: { title: 'Mindset and Mantra',   emoji: '🌿', phase: 5, game: 'quiz',      xp: 100, desc: 'Arrive with the right spirit' },
}

// Each prompt returns a compact but specific game structure
function buildPrompt(level, dest, country, travelDate, homecity, days) {
  const d = dest, c = country || '', t = travelDate || 'next year', h = homecity || 'your city'

  const prompts = {
    1: `Create a 6-question travel personality quiz about ${d}, ${c}.
Each question has 4 options. The correct answer reveals a TRUE fact about ${d}.
{
  "archetype": "The [Descriptive Name] — e.g. The Temple Wanderer",
  "archetypeDesc": "Two sentences describing this travel style in ${d}.",
  "questions": [
    { "q": "Question text about travelling in ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "fact": "Interesting true fact about ${d} that this answer reveals." }
  ]
}
Include exactly 6 questions.`,

    2: `Create exactly 10 True or False statements about ${d}, ${c}. Make 5 true and 5 false, mixed. Make them genuinely surprising.
{
  "statements": [
    { "statement": "Claim about ${d}.", "answer": true, "explanation": "Why this is true with interesting context.", "emoji": "🌊" },
    { "statement": "Believable myth about ${d}.", "answer": false, "explanation": "Why this is false and what the truth is.", "emoji": "❌" }
  ]
}
Include exactly 10 statements.`,

    3: `Create a neighbourhood matching game for ${d}, ${c} with 6 pairs.
{
  "intro": "One sentence on why knowing ${d}s areas transforms the trip.",
  "pairs": [
    { "area": "Neighbourhood Name", "vibe": "Short punchy description max 8 words", "fact": "Interesting fact revealed after matching." }
  ]
}
Include exactly 6 pairs.`,

    4: `Create 6 quiz questions about iconic experiences in ${d}, ${c} that build excitement.
{
  "questions": [
    { "q": "Evocative question about an experience in ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "revelation": "The full story — why this experience is extraordinary." }
  ]
}
Include exactly 6 questions.`,

    5: `Create 6 quiz questions about visa and entry requirements for ${d}, ${c}.
{
  "questions": [
    { "q": "Question about visa or entry for ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "explanation": "Why this is correct and what to actually do." }
  ]
}
Include exactly 6 questions.`,

    6: `Create 8 True or False health and safety statements about ${d}, ${c}.
{
  "statements": [
    { "statement": "Health or safety claim about ${d}.", "answer": true, "explanation": "Practical explanation and advice.", "emoji": "💊" }
  ]
}
Include exactly 8 statements, mix of true and false.`,

    7: `Create 6 fill-in-the-blank packing questions for ${d}, ${c} in ${t} for ${days} days.
Each sentence has one blank marked as ___ with 3 word options.
{
  "intro": "Packing philosophy for this specific trip.",
  "questions": [
    { "sentence": "For ${d} in ${t}, always pack ___ because the humidity is extreme.", "blank": "light breathable clothing", "options": ["light breathable clothing", "a heavy winter coat", "formal business attire"], "correct": 0, "tip": "Practical tip explaining why." }
  ]
}
Include exactly 6 questions.`,

    8: `Create 6 quiz questions about money and payments in ${d}, ${c}.
{
  "questions": [
    { "q": "Money question about ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "explanation": "Practical money advice." }
  ]
}
Include exactly 6 questions.`,

    9: `Create a transport matching game for ${d}, ${c} with 6 pairs.
Match transport mode to cost or use case.
{
  "pairs": [
    { "area": "Transport mode name", "vibe": "Cost and when to use it, max 8 words", "fact": "Insider transport tip revealed after matching." }
  ]
}
Include exactly 6 pairs.`,

    10: `Create 12 essential travel flashcards for ${d}, ${c}.
{
  "language": "Language name",
  "script": "Latin or Arabic or Cyrillic etc",
  "cards": [
    { "front": "Hello", "back": "Local word", "pronunciation": "Phonetic spelling", "category": "greeting", "emoji": "👋", "memoryHook": "Memory trick to remember this word." }
  ]
}
Include exactly 12 cards: hello, goodbye, please, thank you, sorry, yes, no, how much, where is bathroom, help, I do not understand, do you speak English.`,

    11: `Create 10 food and restaurant flashcards for ${d}, ${c}.
{
  "cards": [
    { "front": "English phrase", "back": "Local language", "pronunciation": "Phonetic", "category": "ordering", "emoji": "🍽", "memoryHook": "Memory trick." }
  ]
}
Include exactly 10 cards covering ordering, dietary needs, compliments, and asking for the bill.`,

    12: `Create 10 emergency flashcards for ${d}, ${c}.
{
  "emergencyNumbers": { "police": "number", "ambulance": "number" },
  "cards": [
    { "front": "English phrase", "back": "Local language", "pronunciation": "Phonetic", "category": "emergency", "emoji": "🆘", "memoryHook": "Context or trick." }
  ]
}
Include exactly 10 cards for police, medical, lost, theft, and directions when desperate.`,

    13: `Create 6 cultural etiquette scenario quiz questions for ${d}, ${c}.
Wrong answers should be common Western assumptions.
{
  "questions": [
    { "q": "Scenario: You are invited to a local home in ${d}. You should...", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "explanation": "Cultural reasoning behind the correct answer." }
  ]
}
Include exactly 6 scenario questions.`,

    14: `Create a dish matching game for ${d}, ${c} with 6 pairs.
Match iconic dish to its defining characteristic.
{
  "pairs": [
    { "area": "Dish name with emoji", "vibe": "Its defining characteristic in 6 to 8 words", "fact": "The story or secret behind this dish." }
  ]
}
Include exactly 6 pairs.`,

    15: `Create 6 quiz questions about markets and street food in ${d}, ${c}.
{
  "questions": [
    { "q": "Street food or market question for ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "explanation": "Practical food advice." }
  ]
}
Include exactly 6 questions.`,

    16: `Create 8 True or False drink culture statements about ${d}, ${c}.
Cover coffee, alcohol, tea, and toasting customs.
{
  "statements": [
    { "statement": "Drink culture claim about ${d}.", "answer": true, "explanation": "Context and practical advice.", "emoji": "☕" }
  ]
}
Include exactly 8 statements, mix of true and false.`,

    17: `Create 6 fill-in-the-blank recipe questions for the most iconic dish of ${d}, ${c}.
{
  "dish": "Dish name",
  "emoji": "Food emoji",
  "story": "One sentence on the cultural significance of this dish.",
  "questions": [
    { "sentence": "The ___ is added last to keep its bright colour.", "blank": "correct answer", "options": ["correct answer", "wrong option one", "wrong option two"], "correct": 0, "tip": "Cooking insight explaining why." }
  ]
}
Include exactly 6 questions.`,

    18: `Create 6 Day 1 quiz questions for ${d}, ${c} for a traveller from ${h} for ${days} days.
Cover airport transfer, first meal, common mistakes, and orientation.
{
  "questions": [
    { "q": "Day 1 decision question for ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "explanation": "Local knowledge behind this answer." }
  ]
}
Include exactly 6 questions.`,

    19: `Create a hidden gems matching game for ${d}, ${c} with 6 pairs.
These are places most tourists completely miss.
{
  "pairs": [
    { "area": "Hidden gem name", "vibe": "What makes it special in 7 to 8 words", "fact": "Why it is worth seeking out." }
  ]
}
Include exactly 6 pairs.`,

    20: `Create 6 mindset and travel philosophy quiz questions for ${d}, ${c}.
Make them feel wise and thoughtful, not trivial.
{
  "mantra": "A 5 to 7 word travel mantra specific to ${d}",
  "questions": [
    { "q": "Thoughtful question about being truly present in ${d}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "wisdom": "Genuine travel insight, 1 to 2 sentences." }
  ]
}
Include exactly 6 questions.`,
  }

  return prompts[level] || null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { level, dest, country, travelDate, homecity, days } = req.body
  if (!level || !dest) return res.status(400).json({ error: 'level and dest are required' })

  const prompt = buildPrompt(
    parseInt(level), dest,
    country || '',
    travelDate || 'your travel month',
    homecity || 'your city',
    days || 7
  )

  if (!prompt) return res.status(400).json({ error: `Unknown level: ${level}` })

  const aiResult = await callAI(prompt, 1800)

  if (!aiResult) {
    return res.status(503).json({
      error: 'AI service unavailable. Check that GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY are set in your Vercel environment variables.',
    })
  }

  const data = parseJSON(aiResult.text)

  if (!data) {
    return res.status(422).json({
      error: 'Parse failed — the AI response could not be parsed as JSON.',
      raw: aiResult.text.slice(0, 500),
      provider: aiResult.provider,
    })
  }

  return res.json({ data, level, provider: aiResult.provider })
}
