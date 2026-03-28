// lib/parseJSON.js — Handles every weird thing AI models return

export function parseRobustJSON(raw) {
  if (!raw) return null
  if (typeof raw === 'object' && !Array.isArray(raw)) return postProcess(raw)

  // Strip markdown fences
  let s = String(raw)
    .replace(/^```json\s*/im, '').replace(/^```\s*/im, '').replace(/```\s*$/im, '').trim()

  // Direct parse
  try { return postProcess(JSON.parse(s)) } catch {}

  // Extract { ... } block
  const si = s.indexOf('{'), ei = s.lastIndexOf('}')
  if (si !== -1 && ei > si) {
    const slice = s.slice(si, ei + 1)
    try { return postProcess(JSON.parse(slice)) } catch {}

    // Repair truncated JSON
    try {
      let p = slice
        .replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, '')
        .replace(/,\s*"[^"]*"\s*:\s*\[[^\]]*$/, ']')
        .replace(/,\s*"[^"]*"\s*$/, '')
      const opens  = (p.match(/\[/g)||[]).length - (p.match(/\]/g)||[]).length
      const braces = (p.match(/\{/g)||[]).length - (p.match(/\}/g)||[]).length
      p += ']'.repeat(Math.max(0, opens)) + '}'.repeat(Math.max(0, braces))
      return postProcess(JSON.parse(p))
    } catch {}
  }

  return null
}

// Handles these AI failure modes:
// 1. AI puts entire JSON as string value inside description/result/response field
// 2. AI returns outer wrapper with the real data nested inside
function postProcess(obj) {
  if (!obj || typeof obj !== 'object') return obj

  // Check if any string field contains a more complete JSON object
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (typeof val !== 'string') continue
    const trimmed = val.trim()
    if (!trimmed.startsWith('{')) continue

    try {
      const inner = JSON.parse(trimmed)
      if (!inner || typeof inner !== 'object') continue

      // Count "real" fields in inner vs outer
      const KNOWN = ['dish','questions','statements','pairs','cards','phrases','flights','story','mantra','language','intro','archetype']
      const innerScore = KNOWN.filter(f => f in inner).length
      const outerScore = KNOWN.filter(f => f in obj).length

      // If inner has meaningful fields that outer doesn't, or inner has more, use inner
      if (innerScore > outerScore || (innerScore > 0 && key === 'description')) {
        console.log(`parseJSON: unwrapped nested JSON from field "${key}"`)
        return inner
      }
    } catch {}
  }

  return obj
}
