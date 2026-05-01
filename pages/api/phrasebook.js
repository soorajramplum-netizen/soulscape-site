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

  // BCP-47 codes for Web Speech API
  const LANG_CODES = {
    japanese:'ja-JP', thai:'th-TH', indonesian:'id-ID', italian:'it-IT',
    french:'fr-FR', spanish:'es-ES', portuguese:'pt-PT', greek:'el-GR',
    vietnamese:'vi-VN', moroccan:'ar-MA', croatian:'hr-HR', turkish:'tr-TR',
    hindi:'hi-IN', nepali:'ne-NP', mandarin:'zh-CN', german:'de-DE',
    slovenian:'sl-SI', norwegian:'nb-NO', icelandic:'is-IS', danish:'da-DK',
    dutch:'nl-NL', polish:'pl-PL', czech:'cs-CZ', georgian:'ka-GE',
    malay:'ms-MY', russian:'ru-RU', swahili:'sw-KE', latinspanish:'es-MX',
    brazilianportuguese:'pt-BR', english:'en-US', finnish:'fi-FI',
    swedish:'sv-SE', hungarian:'hu-HU', romanian:'ro-RO', burmese:'my-MM',
    mongolian:'mn-MN', tibetan:'bo-CN', amharic:'am-ET', kinyarwanda:'rw-RW',
    uzbek:'uz-UZ', turkmen:'tk-TM', arabic:'ar-OM', cantonese:'zh-HK',
    irish:'ga-IE', maltese:'mt-MT', singlish:'en-SG', lao:'lo-LA',
    seychellois:'fr-SC',
  }

  return res.json({
    language: pb.language,
    flag: pb.flag,
    script: pb.script,
    phrases,
    culturalTips: pb.tips || [],
    langKey,
    langCode: LANG_CODES[langKey] || 'en-US',
  })
}
