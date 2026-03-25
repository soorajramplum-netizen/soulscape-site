// pages/api/match.js
// Receives user's text, returns matched destination + personal sentence
// All AI keys stay server-side

import { callAI, parseJSON } from '../../lib/ai'
import { matchDestination, DESTINATIONS } from '../../data/destinations'

const PROMPT = `You are SoulScape's emotional and geographic reader.

Read what someone wrote and extract their emotional need profile.

CRITICAL: If they mention a SPECIFIC PLACE TYPE (mountain, beach, forest, desert, waterfall, city, garden, ocean, snow, aurora, lake) — map that directly.

NEED VECTOR — 6 numbers each 1-5:
1. scale: vastness (1=intimate, 5=overwhelming/vast)
2. complexity: visual richness (1=bare, 5=layered/rich)
3. humans: presence (1=total solitude, 5=bustling/alive)
4. age: geological time (1=new/seasonal, 5=primordial)
5. energy: movement (1=perfectly still, 5=dramatic/powerful)
6. tone: temperature feel (1=cool/raw, 5=warm/golden/soft)

EXPLICIT PLACE MAPPINGS:
mountain/alps/peak/summit → [5,2,1,5,3,2]
beach/ocean/sea/coast/waves → [3,2,1,4,3,5]
forest/woods/trees/jungle → [2,3,1,5,2,3]
desert/sand/dunes → [5,1,1,5,1,5]
waterfall/falls/cascade → [3,2,1,3,5,3]
city/cities/urban/town → [2,4,5,2,4,4]
garden/flowers/bloom/park → [2,3,3,2,2,4]
aurora/arctic/snow/iceland/norway → [4,1,1,5,3,1]
lake/river/lagoon → [3,2,1,4,2,4]

EMOTIONAL MAPPINGS (when no explicit place):
stressed/overwhelmed/pressure → [4,1,1,5,1,4]
anxious/worried → [2,3,1,4,2,2]
sad/grief/loss → [2,3,4,2,3,4]
lonely/alone → [2,4,5,2,3,5]
angry/frustrated → [4,1,1,4,5,2]
tired/exhausted/burnout → [3,1,1,5,1,4]
happy/excited/joyful → [4,3,2,4,4,5]
numb/disconnected → [2,5,5,2,4,5]

Return ONLY valid JSON:
{"need":[n1,n2,n3,n4,n5,n6],"sentence":"1-2 warm sentences specific to what they wrote, do not name the destination","emotion":"one word"}`

function localFallback(text) {
  const t = text.toLowerCase()
  if (t.match(/mountain|mountains|alps|peak|summit|everest|himalay/)) return [5,2,1,5,3,2]
  if (t.match(/beach|ocean|sea|coast|waves|maldives|tropical/))       return [3,2,1,4,3,5]
  if (t.match(/forest|jungle|woods|tree|bamboo/))                     return [2,3,1,5,2,3]
  if (t.match(/desert|sand|dune|sahara/))                             return [5,1,1,5,1,5]
  if (t.match(/waterfall|falls|cascade/))                             return [3,2,1,3,5,3]
  if (t.match(/city|urban|town|street/))                              return [2,4,5,2,4,4]
  if (t.match(/garden|flower|bloom|park|lavender/))                   return [2,3,3,2,2,4]
  if (t.match(/aurora|arctic|snow|ice|iceland|norway/))               return [4,1,1,5,3,1]
  if (t.match(/lake|river|lagoon|fjord/))                             return [3,2,1,4,2,4]
  if (t.match(/stress|overwhelm|pressure|hectic/))                    return [4,1,1,5,1,4]
  if (t.match(/anxi|panic|worry|nervous/))                            return [2,3,1,4,2,2]
  if (t.match(/sad|grief|lost|hopeless/))                             return [2,3,4,2,3,4]
  if (t.match(/angry|rage|frustrat/))                                 return [4,1,1,4,5,2]
  if (t.match(/tired|exhaust|drain|burnout/))                         return [3,1,1,5,1,4]
  if (t.match(/lonely|alone|miss/))                                   return [2,4,5,2,3,5]
  if (t.match(/happy|joy|excited|great/))                             return [4,3,2,4,4,5]
  return [3,2,1,4,2,3]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text, nearbyOnly, userLat, userLng } = req.body
  if (!text) return res.status(400).json({ error: 'text required' })

  let needVector = null
  let sentence = ''
  let emotion = 'exploring'

  // Try AI first
  const aiResult = await callAI(PROMPT + '\n\nPerson wrote:\n"' + text + '"')
  if (aiResult) {
    const parsed = parseJSON(aiResult.text)
    if (parsed?.need?.length === 6) {
      needVector = parsed.need
      sentence = parsed.sentence || ''
      emotion = parsed.emotion || 'exploring'
    }
  }

  // Fall back to local keyword matching
  if (!needVector) {
    needVector = localFallback(text)
  }

  // Filter by proximity if requested
  let pool = DESTINATIONS
  if (nearbyOnly && userLat != null && userLng != null) {
    const nearby = DESTINATIONS.filter(d => {
      const R = 6371
      const dLat = (d.lat - userLat) * Math.PI / 180
      const dLng = (d.lng - userLng) * Math.PI / 180
      const a = Math.sin(dLat/2)**2 + Math.cos(userLat*Math.PI/180)*Math.cos(d.lat*Math.PI/180)*Math.sin(dLng/2)**2
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) < 3000
    })
    if (nearby.length >= 5) pool = nearby
  }

  const dest = matchDestination(needVector, pool)

  res.json({
    dest,
    sentence,
    emotion,
    provider: aiResult?.provider || 'local',
  })
}
