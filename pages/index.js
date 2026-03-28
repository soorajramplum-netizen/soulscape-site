// pages/index.js
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DESTINATIONS, CATS, slugify } from '../data/destinations'

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

  useEffect(() => {
    setDaily(getDailyDest())
    const c = localStorage.getItem('ss_city')
    if (c) setSavedCity(c)
    const ci = localStorage.getItem('ss_city_input')
    if (ci) setCityInput(ci)
  }, [])

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

      <main style={styles.main}>
        {/* Badge */}
        <div style={styles.badge}>
          <div style={styles.dot} />
          {DESTINATIONS.length} Destinations
        </div>

        {/* Title */}
        <h1 style={styles.title}>
          <span style={styles.t1}>Soul</span>
          <span style={styles.t2}>Scape</span>
        </h1>
        <p style={styles.sub}>A place in this world speaks to exactly how you feel right now.</p>

        {/* City input */}
        <div style={styles.cityRow}>
          <input
            style={styles.cityInput}
            placeholder="Your city (e.g. Mumbai, India)"
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveCity()}
          />
          <button className="btn-primary" style={{ padding: '12px 18px', fontSize: 13 }} onClick={saveCity}>
            Save
          </button>
        </div>
        {savedCity && (
          <p style={styles.cityConfirm}>📍 {savedCity}</p>
        )}

        {/* CTAs */}
        <div style={styles.ctas}>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => router.push('/feel')}>
            How Am I Feeling?
          </button>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={() => router.push('/globe')}>
            Explore the Globe 🌍
          </button>
        </div>

        {/* Daily Drop */}
        {daily && (
          <button style={styles.dailyDrop} onClick={() => router.push('/place/' + slugify(daily.name))}>
            <div style={styles.ddEyebrow}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', animation: 'blink 2s infinite' }} />
              3 Minute Vacation · Daily Drop
            </div>
            <div style={styles.ddName}>{daily.name}</div>
            <div style={styles.ddSub}>{daily.country} · {CATS[daily.cat].emoji} {CATS[daily.cat].name}</div>
          </button>
        )}

        {/* Bottom nav */}
        <div style={styles.bottomNav}>
          <button style={styles.navBtn} onClick={() => router.push('/scapedex')}>📖 ScapeDex</button>
          <button style={styles.navBtn} onClick={() => router.push('/passport')}>🛂 Passport</button>
          <button style={{...styles.navBtn, borderColor:'rgba(232,146,74,.2)', color:'var(--amber)'}} onClick={() => router.push('/planner')}>✈ Trip Planner</button>
        </div>
      </main>

      <style jsx>{`
        @keyframes blink { 0%,100% { opacity:.2; } 50% { opacity:1; } }
      `}</style>
    </>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 30% 0%, #1A0F28 0%, #0A0812 60%)',
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
    background: 'var(--ink2)',
    border: '1px solid rgba(240,235,224,.12)',
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
    background: 'rgba(232,146,74,.06)',
    cursor: 'pointer',
    width: '100%',
    maxWidth: 340,
    textAlign: 'left',
    marginBottom: 24,
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
  bottomNav: {
    display: 'flex',
    gap: 12,
  },
  navBtn: {
    background: 'var(--ink2)',
    border: '1px solid rgba(240,235,224,.08)',
    color: 'var(--mist)',
    padding: '10px 18px',
    borderRadius: 100,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
}
