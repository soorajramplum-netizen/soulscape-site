// pages/place/[id].js
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { DESTINATIONS, CATS, getDestinationById, slugify } from '../../data/destinations'

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY || ''

export default function Place() {
  const router = useRouter()
  const { id } = router.query

  const [dest, setDest] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [sentence, setSentence] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [priceData, setPriceData] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [cuisine, setCuisine] = useState(null)
  const [cuisineLoading, setCuisineLoading] = useState(false)
  const [phrasebook, setPhrasebook] = useState(null)
  const [phraseLoading, setPhraseLoading] = useState(false)
  const [originCity, setOriginCity] = useState('')
  const [originInput, setOriginInput] = useState('')
  const videoRef = useRef(null)

  useEffect(() => {
    if (!id) return
    const d = getDestinationById(id)
    if (!d) { router.push('/'); return }
    setDest(d)

    // Get AI sentence if coming from feel page
    const s = sessionStorage.getItem('ss_sentence')
    if (s) { setSentence(s); sessionStorage.removeItem('ss_sentence') }

    // Stamp passport & dex
    stampVisit(d)

    // Load saved city
    const city = localStorage.getItem('ss_city') || ''
    setOriginCity(city)
    setOriginInput(city)

    // Fetch video
    fetchVideo(d)
  }, [id])

  function stampVisit(d) {
    try {
      const emotion = sessionStorage.getItem('ss_emotion') || 'exploring'
      sessionStorage.removeItem('ss_emotion')
      // Passport
      const psp = JSON.parse(localStorage.getItem('ss_psp_v2') || '[]')
      psp.push({ name: d.name, country: d.country, cat: d.cat, emotion, ts: Date.now(), emoji: CATS[d.cat].emoji })
      if (psp.length > 60) psp.splice(0, psp.length - 60)
      localStorage.setItem('ss_psp_v2', JSON.stringify(psp))
      // Dex
      const dex = new Set(JSON.parse(localStorage.getItem('ss_dex_v1') || '[]'))
      dex.add(d.name)
      localStorage.setItem('ss_dex_v1', JSON.stringify([...dex]))
    } catch(e) {}
  }

  async function fetchVideo(d) {
    if (!PEXELS_KEY) return
    const nameHash = d.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const page = (nameHash % 4) + 1
    const pick = nameHash % 10
    const queries = [d.q1, d.q2, CATS[d.cat].name + ' aerial drone cinematic']
    for (const q of queries) {
      try {
        const r = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=10&page=${page}&min_duration=5`,
          { headers: { Authorization: PEXELS_KEY } }
        )
        if (!r.ok) continue
        const data = await r.json()
        const real = (data.videos || []).filter(v => v.video_files?.some(f => f.link?.includes('.mp4') && f.width >= 640))
        if (!real.length) continue
        const v = real[pick % real.length]
        const files = v.video_files.filter(f => f.link?.includes('.mp4') && f.width >= 640).sort((a, b) => b.width - a.width)
        const f = files.find(f => f.width >= 1280 && f.width <= 1920) || files[0]
        if (f) { setVideoUrl(f.link); break }
      } catch(e) { continue }
    }
  }

  async function loadPrices() {
    const city = originInput.trim() || originCity
    if (!city) { alert('Please enter your city first'); return }
    if (city !== originCity) {
      localStorage.setItem('ss_city', city)
      setOriginCity(city)
    }
    setPriceLoading(true)
    setPriceData(null)
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destName: dest.name, destCountry: dest.country, originCity: city }),
      })
      const data = await res.json()
      setPriceData(data)
    } catch(e) {
      setPriceData({ error: 'Could not load prices. Try again.' })
    }
    setPriceLoading(false)
  }

  async function loadCuisine() {
    if (cuisine) return
    setCuisineLoading(true)
    try {
      const res = await fetch('/api/cuisine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destName: dest.name, destCountry: dest.country }),
      })
      setCuisine(await res.json())
    } catch(e) {}
    setCuisineLoading(false)
  }

  async function loadPhrasebook() {
    if (phrasebook) return
    setPhraseLoading(true)
    try {
      const res = await fetch('/api/phrasebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destName: dest.name, destCountry: dest.country }),
      })
      setPhrasebook(await res.json())
    } catch(e) {}
    setPhraseLoading(false)
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'cuisine' && !cuisine) loadCuisine()
    if (tab === 'speak' && !phrasebook) loadPhrasebook()
    if (tab === 'prices' && !priceData) {} // user triggers manually
  }

  if (!dest) return <div style={{ background: 'var(--ink)', minHeight: '100vh' }} />

  const cat = CATS[dest.cat]

  return (
    <>
      <Head>
        <title>{dest.name} — SoulScape</title>
        <meta name="description" content={dest.desc} />
      </Head>

      <div style={styles.page}>
        {/* VIDEO AREA — 75% */}
        <div style={{ ...styles.videoArea, background: cat.glow ? `radial-gradient(ellipse at center, ${cat.glow} 0%, ${cat.glow} 60%, #060810 100%)` : '#060810' }}>
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay muted loop playsInline
              style={styles.video}
            />
          )}

          {/* Top bar */}
          <div style={styles.topBar}>
            <button className="btn-back" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => router.back()}>
              🏠 Home
            </button>
            <span style={styles.vlogo}>SoulScape</span>
            <span style={styles.catTag}>{cat.emoji} {cat.name}</span>
          </div>

          {/* AI sentence overlay */}
          {sentence && (
            <div style={styles.sentenceOverlay}>
              <p style={styles.sentenceTxt}>{sentence}</p>
            </div>
          )}
        </div>

        {/* CONTENT PANEL — 25% */}
        <div style={styles.panel}>
          <div style={styles.panelTop}>
            <div style={styles.crumbs}>
              <span style={styles.country}>{dest.country.toUpperCase()}</span>
              <span style={styles.sep}>·</span>
              <span style={styles.country}>{cat.name.toUpperCase()}</span>
            </div>
            <h1 style={styles.destName}>{dest.name}</h1>
          </div>

          {/* Tabs */}
          <div style={styles.tabRow}>
            {['info', 'prices', 'cuisine', 'speak'].map(tab => (
              <button
                key={tab}
                style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabBtnActive : {}) }}
                onClick={() => handleTabChange(tab)}
              >
                {{ info: 'ℹ Info', prices: '✈ Prices', cuisine: '🍽 Cuisine', speak: '💬 Speak' }[tab]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={styles.tabContent}>
            {activeTab === 'info' && (
              <div style={styles.infoTab}>
                <p style={styles.desc}>{dest.desc}</p>
                <div style={styles.actionRow}>
                  <button className="btn-back" onClick={() => router.push('/')}>← Home</button>
                  <button className="btn-back" onClick={() => router.push('/scapedex')}>📖 ScapeDex</button>
                  <button className="btn-back" onClick={() => router.push('/passport')}>🛂 Passport</button>
                </div>
              </div>
            )}

            {activeTab === 'prices' && (
              <div style={styles.pricesTab}>
                <div style={styles.originRow}>
                  <input
                    style={styles.originInput}
                    placeholder="Your city (e.g. Delhi, India)"
                    value={originInput}
                    onChange={e => setOriginInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && loadPrices()}
                  />
                  <button className="btn-primary" style={{ padding: '10px 16px', fontSize: 12 }} onClick={loadPrices}>
                    {priceLoading ? '…' : 'Check'}
                  </button>
                </div>
                {priceLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner" /></div>}
                {priceData && !priceData.error && <PriceDisplay data={priceData} />}
                {priceData?.error && <p style={{ color: '#FF6B6B', fontSize: 13 }}>{priceData.error}</p>}
              </div>
            )}

            {activeTab === 'cuisine' && (
              <div style={styles.cuisineTab}>
                {cuisineLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner" /></div>}
                {cuisine && <CuisineDisplay data={cuisine} />}
              </div>
            )}

            {activeTab === 'speak' && (
              <div style={styles.speakTab}>
                {phraseLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner" /></div>}
                {phrasebook && <PhrasebookDisplay data={phrasebook} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function PriceDisplay({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PriceCard emoji="✈" title="Flights" rows={[
        ['Economy', data.flights?.economy || '—'],
      ]} note={data.flights?.notes} />
      <PriceCard emoji="🏨" title="Hotels / Night" rows={[
        ['Budget', data.hotel?.budget || '—'],
        ['Mid', data.hotel?.mid || '—'],
        ['Luxury', data.hotel?.luxury || '—'],
      ]} />
      <PriceCard emoji="💰" title="Daily Spend" rows={[
        ['Budget traveller', data.dailyCost?.budget || '—'],
        ['Mid traveller', data.dailyCost?.mid || '—'],
      ]} />
      {data.bestTime && <p style={{ fontSize: 12, color: 'var(--amber)' }}>🗓 Best time: {data.bestTime}</p>}
      {data.currency && <p style={{ fontSize: 12, color: 'var(--mist)' }}>💱 {data.currency}</p>}
      {data.tips?.map((t, i) => <p key={i} style={{ fontSize: 12, color: 'var(--mist)' }}>💡 {t}</p>)}
      <p style={{ fontSize: 10, color: 'rgba(154,136,120,.5)', marginTop: 4 }}>AI estimates — verify before booking</p>
    </div>
  )
}

function PriceCard({ emoji, title, rows, note }) {
  return (
    <div style={{ background: 'var(--ink2)', borderRadius: 10, padding: '12px 14px' }}>
      <p style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 8 }}>{emoji} {title}</p>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--mist)' }}>{label}</span>
          <span style={{ fontSize: 12, color: 'var(--sand)', fontWeight: 600 }}>{value}</span>
        </div>
      ))}
      {note && <p style={{ fontSize: 11, color: 'var(--mist)', marginTop: 6, fontStyle: 'italic' }}>{note}</p>}
    </div>
  )
}

function CuisineDisplay({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 4 }}>{data.emoji}</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: 'var(--amber)', marginBottom: 6 }}>{data.dish}</h3>
        <p style={{ fontSize: 13, color: 'rgba(240,232,214,.65)', fontStyle: 'italic', lineHeight: 1.6 }}>{data.description}</p>
      </div>
      <div style={{ background: 'var(--ink2)', borderRadius: 10, padding: '12px 14px' }}>
        <p style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 8 }}>Ingredients</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {data.ingredients?.map(i => (
            <span key={i} style={{ background: 'var(--ink3)', borderRadius: 100, padding: '4px 12px', fontSize: 11, color: 'rgba(240,232,214,.7)' }}>{i}</span>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--ink2)', borderRadius: 10, padding: '12px 14px' }}>
        <p style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 8 }}>How to Make It</p>
        {data.steps?.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(232,146,74,.2)', border: '1px solid rgba(232,146,74,.4)', color: 'var(--amber)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
            <p style={{ fontSize: 13, color: 'rgba(240,232,214,.75)', lineHeight: 1.6, flex: 1 }}>{s}</p>
          </div>
        ))}
      </div>
      {data.alsoTry && (
        <p style={{ fontSize: 12, color: 'var(--mist)' }}>Also try: {data.alsoTry.join(', ')}</p>
      )}
    </div>
  )
}

function PhrasebookDisplay({ data }) {
  const [flipped, setFlipped] = useState({})
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 12, color: 'var(--amber)' }}>
        {data.language} {data.script ? `(${data.script})` : ''}
      </p>
      {data.phrases?.map((p, i) => (
        <div
          key={i}
          style={{ background: 'var(--ink2)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', border: flipped[i] ? '1px solid rgba(232,146,74,.3)' : '1px solid rgba(240,235,224,.06)' }}
          onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 3 }}>{p.emoji} {p.category}</p>
              <p style={{ fontSize: 14, color: 'var(--sand)', fontWeight: 600 }}>{p.english}</p>
              {flipped[i] && (
                <>
                  <p style={{ fontSize: 16, color: 'var(--amber)', marginTop: 6, fontFamily: "'Cormorant Garamond', serif" }}>{p.local}</p>
                  <p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 3, fontStyle: 'italic' }}>say: {p.pronunciation}</p>
                </>
              )}
            </div>
            <span style={{ color: 'var(--mist)', fontSize: 18 }}>{flipped[i] ? '−' : '+'}</span>
          </div>
        </div>
      ))}
      {data.culturalTips && (
        <div style={{ background: 'var(--ink2)', borderRadius: 10, padding: '12px 14px', marginTop: 4 }}>
          <p style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 8 }}>Cultural Tips</p>
          {data.culturalTips.map((t, i) => <p key={i} style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 5 }}>• {t}</p>)}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--ink)' },
  videoArea: { flex: '0 0 75%', position: 'relative', overflow: 'hidden' },
  video: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  topBar: { position: 'absolute', top: 'max(14px,calc(var(--st)+6px))', left: 14, right: 14, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  vlogo: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,.85)', textShadow: '0 2px 10px rgba(0,0,0,.6)' },
  catTag: { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', background: 'rgba(0,0,0,.3)', backdropFilter: 'blur(6px)', padding: '4px 11px', borderRadius: 100, border: '1px solid rgba(255,255,255,.1)' },
  sentenceOverlay: { position: 'absolute', bottom: '28%', left: 0, right: 0, padding: '0 24px', zIndex: 25, pointerEvents: 'none' },
  sentenceTxt: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(15px,4vw,20px)', fontStyle: 'italic', color: 'rgba(255,255,255,.9)', textAlign: 'center', lineHeight: 1.7, textShadow: '0 2px 20px rgba(0,0,0,.8)', maxWidth: 380, margin: '0 auto' },
  panel: { flex: 1, background: 'var(--ink)', borderTop: '1px solid rgba(232,146,74,.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  panelTop: { padding: '10px 16px 0', flexShrink: 0 },
  crumbs: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 },
  country: { fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mist)' },
  sep: { fontSize: 9, color: 'rgba(154,136,120,.35)' },
  destName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px,5vw,34px)', fontWeight: 700, color: 'var(--sand)', lineHeight: 1, letterSpacing: -.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  tabRow: { display: 'flex', gap: 4, padding: '8px 12px 0', flexShrink: 0, overflowX: 'auto' },
  tabBtn: { background: 'var(--ink3)', border: '1px solid rgba(240,232,214,.08)', color: 'rgba(240,232,214,.5)', padding: '6px 12px', borderRadius: 100, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 },
  tabBtnActive: { background: 'rgba(232,146,74,.18)', borderColor: 'var(--amber)', color: 'var(--amber)' },
  tabContent: { flex: 1, overflowY: 'auto', padding: '10px 14px', WebkitOverflowScrolling: 'touch' },
  infoTab: { display: 'flex', flexDirection: 'column', gap: 10 },
  desc: { fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(240,232,214,.6)', lineHeight: 1.6 },
  actionRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  pricesTab: { display: 'flex', flexDirection: 'column', gap: 10 },
  originRow: { display: 'flex', gap: 8 },
  originInput: { flex: 1, background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.12)', borderRadius: 8, padding: '10px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--sand)', outline: 'none' },
  cuisineTab: {},
  speakTab: {},
}
