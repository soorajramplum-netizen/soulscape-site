// pages/planner/[tripId].js — Course map: generates + shows 9 levels
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { LEVEL_META } from '../api/planner'
import { COUNTRY_LANGUAGE, PHRASEBOOKS } from '../../data/phrasebook'

export default function TripCourse() {
  const router = useRouter()
  const { tripId } = router.query
  const [trip, setTrip] = useState(null)
  const [course, setCourse] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [genStep, setGenStep] = useState('')
  const [error, setError] = useState('')
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!tripId) return
    const trips = JSON.parse(localStorage.getItem('ss_trips') || '[]')
    const t = trips.find(x => x.id === tripId)
    if (!t) { router.push('/planner'); return }
    setTrip(t)
    setTotalXP(parseInt(localStorage.getItem('ss_xp') || '0'))
    setStreak(parseInt(localStorage.getItem('ss_streak') || '0'))

    // Load cached course
    const cached = localStorage.getItem('ss_course_' + tripId)
    if (cached) {
      try { setCourse(JSON.parse(cached)) } catch {}
      return
    }
    // Auto-generate on first visit
    generateCourse(t)
  }, [tripId])

  async function generateCourse(t) {
    setGenerating(true)
    setGenStep('Researching ' + t.dest + '…')

    // Get language for this destination
    const langKey = COUNTRY_LANGUAGE?.[t.country] || COUNTRY_LANGUAGE?.[t.dest] || 'english'
    const lang = PHRASEBOOKS?.[langKey]?.language || 'English'

    setTimeout(() => setGenStep('Building 110 destination-specific questions…'), 2000)
    setTimeout(() => setGenStep('Crafting your language level…'), 5000)
    setTimeout(() => setGenStep('Almost ready…'), 9000)

    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dest: t.dest,
          country: t.country,
          language: lang,
          travelMonth: t.travelMonth,
        }),
      })
      const data = await res.json()
      if (!data.levels) { setError(data.error || 'Could not generate course. Try again.'); setGenerating(false); return }

      // Add completion tracking to each level
      const withTracking = {
        ...data,
        levels: data.levels.map(l => ({ ...l, complete: false, xpEarned: 0, bestScore: 0 })),
      }
      setCourse(withTracking)
      localStorage.setItem('ss_course_' + tripId, JSON.stringify(withTracking))
    } catch (e) {
      setError('Connection error. Please try again.')
    }
    setGenerating(false)
  }

  function refreshCourse() {
    if (!trip) return
    localStorage.removeItem('ss_course_' + tripId)
    setCourse(null)
    setError('')
    generateCourse(trip)
  }

  if (!trip) return <div style={{ background: 'var(--ink)', minHeight: '100vh' }} />

  const completedLevels = course?.levels?.filter(l => l.complete)?.length || 0
  const totalPct = Math.round(completedLevels / 9 * 100)
  const earnedXP = course?.levels?.reduce((sum, l) => sum + (l.xpEarned || 0), 0) || 0

  // Generating state
  if (generating) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>🧳</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: 'var(--sand)' }}>
        Building your {trip.dest} course
      </h2>
      <p style={{ fontSize: 14, color: 'var(--amber)' }}>{genStep}</p>
      <div style={{ width: 200, height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--amber)', borderRadius: 100, animation: 'loadBar 12s linear forwards' }} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--mist)' }}>110 questions being crafted specifically for {trip.dest}</p>
      <style>{`@keyframes loadBar { from { width:0% } to { width:100% } }`}</style>
    </div>
  )

  // Error state
  if (error) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
      <p style={{ fontSize: 40 }}>⚠️</p>
      <p style={{ color: 'var(--sand)', fontSize: 16 }}>{error}</p>
      <button className="btn-primary" onClick={refreshCourse}>Try Again</button>
      <button className="btn-back" onClick={() => router.push('/planner')}>← Back</button>
    </div>
  )

  if (!course) return <div style={{ background: 'var(--ink)', minHeight: '100vh' }} />

  return (
    <>
      <Head><title>{trip.dest} Course — SoulScape</title></Head>
      <div style={s.page}>

        {/* Header */}
        <div style={s.header}>
          <button className="btn-back" onClick={() => router.push('/planner')}>← Trips</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={s.title}>{trip.dest}</h1>
            <p style={s.meta}>{trip.country} · {trip.travelMonth}</p>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          <div style={s.stat}>
            <span style={s.statN}>{earnedXP}</span>
            <span style={s.statL}>XP Earned</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 56 56" style={{ width: 56, height: 56 }}>
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--amber)" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - totalPct / 100)}`}
                strokeLinecap="round" transform="rotate(-90 28 28)" />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, marginTop: -60 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>{totalPct}%</span>
            </div>
            <span style={s.statL}>{completedLevels}/9 done</span>
          </div>
          <div style={s.stat}>
            <span style={s.statN}>🔥{streak}</span>
            <span style={s.statL}>Streak</span>
          </div>
        </div>

        {/* Level list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {LEVEL_META.map((meta, i) => {
            const levelData = course?.levels?.[i]
            const isComplete = levelData?.complete
            const isAvailable = i === 0 || course?.levels?.[i - 1]?.complete
            const isLocked = !isAvailable

            return (
              <button key={meta.level} disabled={isLocked}
                onClick={() => !isLocked && router.push(`/planner/${tripId}/level/${meta.level}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: isComplete ? 'rgba(88,232,122,.08)' : isAvailable ? `rgba(232,146,74,.08)` : 'var(--ink2)',
                  border: `2px solid ${isComplete ? '#58E87A' : isAvailable ? 'rgba(232,146,74,.35)' : 'rgba(240,235,224,.06)'}`,
                  borderRadius: 16, padding: '16px 18px',
                  cursor: isLocked ? 'default' : 'pointer',
                  opacity: isLocked ? 0.38 : 1,
                  transition: 'all .2s',
                }}>
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: isComplete ? 'rgba(88,232,122,.2)' : 'rgba(232,146,74,.12)',
                  border: `2px solid ${isComplete ? '#58E87A' : isAvailable ? 'rgba(232,146,74,.4)' : 'rgba(255,255,255,.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {isComplete ? '✅' : isLocked ? '🔒' : meta.emoji}
                </div>
                {/* Text */}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: isComplete ? '#58E87A' : 'var(--sand)', margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                      {meta.level === 3 ? '★ ' : ''}{meta.theme}
                    </p>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--mist)', margin: 0 }}>{meta.desc}</p>
                  {isComplete && levelData.xpEarned > 0 && (
                    <p style={{ fontSize: 11, color: '#58E87A', margin: '4px 0 0' }}>✓ +{levelData.xpEarned} XP earned</p>
                  )}
                </div>
                {/* Right */}
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <p style={{ fontSize: 10, color: 'var(--amber)', margin: 0, fontWeight: 600 }}>+{meta.xp}</p>
                  <p style={{ fontSize: 9, color: 'var(--mist)', margin: 0 }}>XP</p>
                  {isAvailable && !isComplete && <span style={{ fontSize: 16, color: 'var(--amber)' }}>→</span>}
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={refreshCourse} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(240,235,224,.08)', color: 'var(--mist)', padding: '12px 0', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
          🔄 Regenerate Course
        </button>

      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--ink)', padding: 'max(52px,calc(var(--st)+24px)) 20px max(32px,calc(var(--sb)+16px))', maxWidth: 520, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', marginBottom: 20 },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--sand)', marginBottom: 2 },
  meta: { fontSize: 12, color: 'var(--mist)' },
  statsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ink2)', borderRadius: 16, padding: '16px 24px', marginBottom: 20, position: 'relative' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statN: { fontSize: 22, fontWeight: 700, color: 'var(--amber)', fontFamily: "'Cormorant Garamond',serif" },
  statL: { fontSize: 9, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'DM Sans',sans-serif" },
}
