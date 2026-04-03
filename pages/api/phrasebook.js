// pages/api/phrasebook.js — serves pre-baked, human-verified phrases. No AI.
import { PHRASEBOOKS, EXTRA_PHRASEBOOKS, COUNTRY_LANGUAGE, EXTRA_COUNTRY_LANGUAGE, PHRASE_KEYS, PHRASE_META } from '../../data/phrasebook'

const ALL_BOOKS = { ...PHRASEBOOKS, ...EXTRA_PHRASEBOOKS }
const ALL_MAP   = { ...COUNTRY_LANGUAGE, ...EXTRA_COUNTRY_LANGUAGE }

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destCountry } = req.body
  if (!destCountry) return res.status(400).json({ error: 'destCountry required' })

  const langKey = ALL_MAP[destCountry] || 'english'
  const pb = ALL_BOOKS[langKey] || ALL_BOOKS['english']

  const phrases = PHRASE_KEYS.map(key => {
    const meta = PHRASE_META[key]
    const [script, pronunciation] = pb.phrases[key] || ['—', '—']
    return {
      category: meta.category,
      emoji: meta.emoji,
      english: meta.english,
      local: script,
      pronunciation,
    }
  })

  return res.json({
    language: pb.language,
    flag: pb.flag,
    script: pb.script,
    phrases,
    culturalTips: pb.tips || [],
  })
}
