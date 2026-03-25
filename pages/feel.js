// pages/feel.js
import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { slugify } from '../data/destinations'

const THINK_MSGS = [
  'Reading between your words…',
  'Feeling what you wrote…',
  'Searching the world for you…',
  'A place is calling your name…',
]

export default function Feel() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [thinking, setThinking] = useState(false)
  const [thinkMsg, setThinkMsg] = useState(THINK_MSGS[0])
  const [rangeMode, setRangeMode] = useState('any')
  const [userLat, setUserLat] = useState(null)
  const [userLng, setUserLng] = useState(null)
  const [locationLabel, setLocationLabel] = useState('')
  const [error, setError] = useState('')
  const taRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    taRef.current?.focus()
  }, [])

  function detectLocation() {
    navigator.geolocation?.getCurrentPosition(pos => {
      setUserLat(pos.coords.latitude)
      setUserLng(pos.coords.longitude)
      setLocationLabel('Location detected ✓')
    }, () => {
      setLocationLabel('Could not detect — try typing your city on the home screen')
    })
  }

  async function handleSend() {
    if (!text.trim() || text.trim().split(/\s+/).length < 3) return
    setThinking(true)
    setError('')

    // Cycle thinking messages
    let i = 0
    timerRef.current = setInterval(() => {
      i = (i + 1) % THINK_MSGS.length
      setThinkMsg(THINK_MSGS[i])
    }, 1100)

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          nearbyOnly: rangeMode === 'near',
          userLat,
          userLng,
        }),
      })
      const data = await res.json()
      clearInterval(timerRef.current)

      if (data.dest) {
        // Store sentence for destination page to read
        if (data.sentence) sessionStorage.setItem('ss_sentence', data.sentence)
        if (data.emotion) sessionStorage.setItem('ss_emotion', data.emotion)
        router.push('/place/' + slugify(data.dest.name))
      } else {
        setError('Something went wrong. Try again.')
        setThinking(false)
      }
    } catch (e) {
      clearInterval(timerRef.current)
      setError('Connection error. Check your internet and try again.')
      setThinking(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Head><title>How Am I Feeling — SoulScape</title></Head>

      <div style={styles.page}>
        {/* Back */}
        <button className="btn-back" style={styles.backBtn} onClick={() => router.push('/')}>
          ← Back
        </button>

        {!thinking ? (
          <div style={styles.wrap}>
            <div style={styles.logo}>🌿</div>
            <h1 style={styles.heading}>Tell me what's going on.</h1>
            <p style={styles.sub}>
              I'll find the place that speaks to exactly how you feel right now.
            </p>

            {/* Location row */}
            <div style={styles.locRow}>
              <button
                style={{ ...styles.locBtn, ...(rangeMode === 'any' ? styles.locBtnActive : {}) }}
                onClick={() => setRangeMode('any')}
              >
                🌍 Anywhere
              </button>
              <button
                style={{ ...styles.locBtn, ...(rangeMode === 'near' ? styles.locBtnActive : {}) }}
                onClick={() => { setRangeMode('near'); detectLocation() }}
              >
                📡 Nearby
              </button>
            </div>
            {locationLabel && <p style={styles.locLabel}>{locationLabel}</p>}

            {/* Textarea */}
            <div style={styles.inputWrap}>
              <textarea
                ref={taRef}
                style={styles.ta}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Just write whatever comes. No right answer. This is only for you."
                maxLength={800}
              />
              <button
                style={{
                  ...styles.sendBtn,
                  opacity: text.trim().split(/\s+/).filter(w => w).length >= 3 ? 1 : 0.25,
                }}
                onClick={handleSend}
                disabled={text.trim().split(/\s+/).filter(w => w).length < 3}
              >
                →
              </button>
            </div>

            {error && <p style={styles.error}>{error}</p>}
          </div>
        ) : (
          <div style={styles.thinking}>
            <div style={styles.thinkDots}>
              <span style={styles.dot1} />
              <span style={styles.dot2} />
              <span style={styles.dot3} />
            </div>
            <p style={styles.thinkMsg}>{thinkMsg}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes tdot {
          0%,80%,100% { transform: scale(.5); opacity: .3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse { 0%,100% { opacity:.3; } 50% { opacity:1; } }
        @keyframes breathe { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
      `}</style>
    </>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--ink)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'max(60px,calc(var(--st)+40px)) 26px max(40px,calc(var(--sb)+20px))',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 'max(16px, calc(var(--st) + 8px))',
    left: 18,
  },
  wrap: {
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: {
    fontSize: 40,
    marginBottom: 22,
    animation: 'breathe 4s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 14px rgba(232,146,74,.3))',
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(34px, 8vw, 56px)',
    fontWeight: 300,
    color: 'var(--sand)',
    letterSpacing: -1,
    marginBottom: 10,
    lineHeight: 1.05,
  },
  sub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 16,
    color: 'var(--mist)',
    maxWidth: 340,
    lineHeight: 1.7,
    marginBottom: 22,
  },
  locRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  locBtn: {
    background: 'var(--ink2)',
    border: '1px solid rgba(240,232,214,.12)',
    color: 'rgba(240,232,214,.5)',
    padding: '8px 16px',
    borderRadius: 100,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all .2s',
  },
  locBtnActive: {
    borderColor: 'var(--amber)',
    color: 'var(--amber)',
    background: 'rgba(232,146,74,.1)',
  },
  locLabel: {
    fontSize: 11,
    color: 'var(--mist)',
    marginBottom: 8,
  },
  inputWrap: {
    width: '100%',
    position: 'relative',
    marginTop: 14,
  },
  ta: {
    width: '100%',
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(240,232,214,.14)',
    borderRadius: 20,
    padding: '22px 64px 22px 22px',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 19,
    lineHeight: 1.75,
    color: 'var(--sand)',
    resize: 'none',
    minHeight: 160,
    outline: 'none',
  },
  sendBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'var(--amber)',
    color: 'var(--ink)',
    border: 'none',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(232,146,74,.4)',
    transition: 'opacity .2s, transform .15s',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 12,
  },
  thinking: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  thinkDots: { display: 'flex', gap: 8, alignItems: 'center' },
  dot1: { width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'tdot 1.4s ease-in-out infinite' },
  dot2: { width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'tdot 1.4s ease-in-out .2s infinite' },
  dot3: { width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'tdot 1.4s ease-in-out .4s infinite' },
  thinkMsg: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontStyle: 'italic',
    color: 'var(--mist)',
    textAlign: 'center',
    animation: 'pulse 2s ease-in-out infinite',
  },
}
