// pages/index.js
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DESTINATIONS, CATS, slugify } from '../data/destinations'

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY || ''

// Curated beautiful destinations for the background slideshow
const BG_QUERIES = [
  'santorini aerial cinematic drone',
  'bali rice terraces drone',
  'patagonia landscape cinematic',
  'amalfi coast aerial',
  'northern lights norway',
  'sahara desert dunes aerial',
  'maldives turquoise lagoon aerial',
  'kyoto cherry blossom',
  'machu picchu aerial drone',
  'cappadocia hot air balloon',
]

function getDailyDest() {
  const d = new Date()
  const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return DESTINATIONS[key % DESTINATIONS.length]
}

export default function Home() {
  const router = useRouter()
  const [daily, setDaily] = useState(null)
  const [cityInput, setCityInput] = useState('')
  const [savedCity, setSavedCity] = useState('')
  const [bgVideos, setBgVideos] = useState([])
  const [currentBg, setCurrentBg] = useState(0)

  useEffect(() => {
    setDaily(getDailyDest())
    const c = localStorage.getItem('ss_city')
    if (c) setSavedCity(c)
    const ci = localStorage.getItem('ss_city_input')
    if (ci) setCityInput(ci)
    if (PEXELS_KEY) fetchBgVideos()
  }, [])

  // Cycle background videos
  useEffect(() => {
    if (bgVideos.length < 2) return
    const timer = setInterval(() => {
      setCurrentBg(i => (i + 1) % bgVideos.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [bgVideos])

  async function fetchBgVideos() {
    const videos = []
    // Pick 4 random queries to keep load time reasonable
    const picked = [...BG_QUERIES].sort(() => Math.random() - 0.5).slice(0, 4)
    for (const q of picked) {
      try {
        const r = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=3&min_duration=8`,
          { headers: { Authorization: PEXELS_KEY } }
        )
        if (!r.ok) continue
        const data = await r.json()
        const v = data.videos?.[0]
        if (!v) continue
        const file = v.video_files
          ?.filter(f => f.link?.includes('.mp4') && f.width >= 640)
          ?.sort((a, b) => a.width - b.width)
          ?.find(f => f.width >= 960 && f.width <= 1920)
        if (file) videos.push(file.link)
      } catch(e) { continue }
    }
    if (videos.length) setBgVideos(videos)
  }

  function saveCity() {
    if (!cityInput.trim()) return
    localStorage.setItem('ss_city', cityInput.trim())
    localStorage.setItem('ss_city_input', cityInput.trim())
    setSavedCity(cityInput.trim())
  }

  return (
    <>
      <Head>
        <title>SoulScape — Where do you need to go?</title>
        <meta name="description" content="A place in this world speaks to exactly how you feel right now." />
      </Head>

      {/* Background video layer */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at 30% 0%, #1A0F28 0%, #0A0812 60%)' }}>
        {bgVideos.map((url, i) => (
          <video
            key={url}
            src={url}
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: i === currentBg ? 0.28 : 0,
              transition: 'opacity 2.5s ease',
            }}
          />
        ))}
        {/* Dark overlay so text stays crisp */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,18,.42)' }} />
      </div>

      <main style={s.main}>

        {/* Badge */}
        <div style={s.badge}>
          <div style={s.dot} />
          {DESTINATIONS.length} Destinations
        </div>

        {/* Logo */}
        <h1 style={s.title}>
          <span style={s.t1}>Soul</span>
          <span style={s.t2}>Scape</span>
        </h1>
        <p style={s.sub}>A place in this world speaks to exactly how you feel right now.</p>

        {/* City input */}
        <div style={s.cityRow}>
          <input
            style={s.cityInput}
            placeholder="Your city (e.g. Mumbai, India)"
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveCity()}
          />
          <button className="btn-primary" style={{ padding: '12px 18px', fontSize: 13 }} onClick={saveCity}>
            Save
          </button>
        </div>
        {savedCity && <p style={s.cityConfirm}>📍 {savedCity}</p>}

        {/* CTAs */}
        <div style={s.ctas}>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => router.push('/feel')}>
            How Am I Feeling?
          </button>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={() => router.push('/globe')}>
            Explore the Globe 🌍
          </button>
        </div>

        {/* Daily Drop */}
        {daily && (
          <button style={s.dailyDrop} onClick={() => router.push('/place/' + slugify(daily.name))}>
            <div style={s.ddEyebrow}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', animation: 'blink 2s infinite' }} />
              3 Minute Vacation · Daily Drop
            </div>
            <div style={s.ddName}>{daily.name}</div>
            <div style={s.ddSub}>{daily.country} · {CATS[daily.cat].emoji} {CATS[daily.cat].name}</div>
          </button>
        )}

        {/* Trip Planner — prominent button below Daily Drop */}
        <button style={s.plannerBtn} onClick={() => router.push('/planner')}>
          <span style={{ fontSize: 28 }}>✈️</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)', margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
              Pre-Trip Planner
            </p>
            <p style={{ fontSize: 12, color: 'var(--mist)', margin: 0, marginTop: 2 }}>
              20 levels · language, food, culture & more
            </p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 18, color: 'rgba(232,146,74,.5)' }}>→</span>
        </button>

        {/* Bottom nav — smaller secondary links */}
        <div style={s.bottomNav}>
          <button style={s.navBtn} onClick={() => router.push('/scapedex')}>📖 ScapeDex</button>
          <button style={s.navBtn} onClick={() => router.push('/passport')}>🛂 Passport</button>
        </div>

      </main>

      <style jsx>{`
        @keyframes blink { 0%,100% { opacity:.2; } 50% { opacity:1; } }
      `}</style>
    </>
  )
}

const s = {
  main: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'max(50px, calc(var(--st) + 24px)) 26px max(36px, calc(var(--sb) + 20px))',
    gap: 0,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    border: '1px solid var(--border)',
    padding: '6px 16px',
    borderRadius: 100,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: 'var(--amber)',
    marginBottom: 22,
    background: 'rgba(10,8,18,.5)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  dot: {
    width: 5, height: 5, borderRadius: '50%',
    background: 'var(--amber)',
    animation: 'blink 2.4s ease-in-out infinite',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 0.92,
  },
  t1: { display: 'block', fontSize: 'clamp(52px,13vw,88px)', fontWeight: 300, letterSpacing: -2, color: 'var(--sand)' },
  t2: { display: 'block', fontSize: 'clamp(52px,13vw,88px)', fontWeight: 700, color: 'var(--amber)', letterSpacing: -2 },
  sub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 16,
    color: 'var(--mist)',
    textAlign: 'center',
    marginBottom: 22,
    maxWidth: 300,
    lineHeight: 1.7,
  },
  cityRow: {
    display: 'flex',
    gap: 8,
    width: '100%',
    maxWidth: 340,
    marginBottom: 6,
  },
  cityInput: {
    flex: 1,
    background: 'rgba(20,16,35,.8)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(240,235,224,.14)',
    borderRadius: 8,
    padding: '12px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: 'var(--sand)',
    outline: 'none',
  },
  cityConfirm: {
    fontSize: 12,
    color: 'var(--amber)',
    marginBottom: 18,
  },
  ctas: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    maxWidth: 340,
    marginTop: 18,
    marginBottom: 20,
  },
  dailyDrop: {
    border: '1px solid rgba(232,146,74,.25)',
    borderRadius: 14,
    padding: '14px 18px',
    background: 'rgba(232,146,74,.07)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    cursor: 'pointer',
    width: '100%',
    maxWidth: 340,
    textAlign: 'left',
    marginBottom: 12,
  },
  ddEyebrow: {
    fontSize: 8,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: 'var(--amber)',
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'DM Sans', sans-serif",
  },
  ddName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--sand)',
    marginBottom: 2,
  },
  ddSub: {
    fontSize: 12,
    color: 'var(--mist)',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Prominent trip planner button
  plannerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    maxWidth: 340,
    padding: '16px 18px',
    background: 'linear-gradient(135deg, rgba(232,146,74,.14), rgba(232,146,74,.06))',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1.5px solid rgba(232,146,74,.4)',
    borderRadius: 16,
    cursor: 'pointer',
    marginBottom: 20,
    textAlign: 'left',
  },

  bottomNav: {
    display: 'flex',
    gap: 12,
  },
  navBtn: {
    background: 'rgba(20,16,35,.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(240,235,224,.08)',
    color: 'var(--mist)',
    padding: '10px 18px',
    borderRadius: 100,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
}
