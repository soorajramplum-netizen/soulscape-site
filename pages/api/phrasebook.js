import { callAI, parseJSON } from '../../lib/ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { destName, destCountry } = req.body
  if (!destName) return res.status(400).json({ error: 'destName required' })

  const prompt = `Give 10 essential travel phrases for ${destName}${destCountry ? ', ' + destCountry : ''}.

Reply with this JSON object and nothing else:
{"language":"Language Name","script":"Latin","phrases":[{"category":"Greeting","english":"Hello","local":"local word","pronunciation":"phonetic","emoji":"👋"},{"category":"Thanks","english":"Thank you","local":"local word","pronunciation":"phonetic","emoji":"🙏"},{"category":"Please","english":"Please","local":"local word","pronunciation":"phonetic","emoji":"🤲"},{"category":"Sorry","english":"Sorry","local":"local word","pronunciation":"phonetic","emoji":"😊"},{"category":"Help","english":"Help!","local":"local word","pronunciation":"phonetic","emoji":"🆘"},{"category":"Price","english":"How much?","local":"local phrase","pronunciation":"phonetic","emoji":"💰"},{"category":"Bathroom","english":"Where is the bathroom?","local":"local phrase","pronunciation":"phonetic","emoji":"🚻"},{"category":"Language","english":"I do not understand","local":"local phrase","pronunciation":"phonetic","emoji":"😕"},{"category":"Food","english":"This is delicious!","local":"local phrase","pronunciation":"phonetic","emoji":"😋"},{"category":"Farewell","english":"Goodbye","local":"local word","pronunciation":"phonetic","emoji":"👋"}],"culturalTips":["Cultural tip 1.","Cultural tip 2.","Cultural tip 3."],"emergencyNumbers":{"police":"number","ambulance":"number","fire":"number"}}`

  const ai = await callAI(prompt, 1200)
  if (!ai) return res.status(503).json({ error: 'AI unavailable. Check API keys in Vercel.' })

  const data = parseJSON(ai.text)
  if (!data?.phrases) return res.status(422).json({ error: 'Could not parse phrases. Please try again.' })
  return res.json({ ...data, provider: ai.provider })
}
