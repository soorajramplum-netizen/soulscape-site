// pages/planner/[tripId].js — Game map view of the 20-level journey

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { PHASES, LEVEL_META } from '../api/planner'

function weeksUntil(d) {
  return Math.round((new Date(d) - Date.now()) / (1000 * 60 * 60 * 24 * 7))
}

export default function TripMap() {
  const router = useRouter()
  const { tripId } = router.query
  const [trip, setTrip] = useState(null)
  const [progress, setProgress] = useState({})
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [activePhase, setActivePhase] = useState(1)

  useEffect(() => {
    if (!tripId) return
    const trips = JSON.parse(localStorage.getItem('ss_trips') || '[]')
    const t = trips.find(x => x.id === tripId)
    if (!t) { router.push('/planner'); return }
    setTrip(t)
    const p = JSON.parse(localStorage.getItem('ss_planner_' + tripId) || '{}')
    setProgress(p)
    setTotalXP(parseInt(localStorage.getItem('ss_total_xp') || '0'))
    setStreak(parseInt(localStorage.getItem('ss_streak') || '0'))
  }, [tripId])

  if (!trip) return <div style={{ background: 'var(--ink)', minHeight: '100vh' }} />

  const weeks = weeksUntil(trip.travelDate)
  const done = Object.values(progress).filter(v => v.complete).length
  const pct = Math.round(done / 8 * 100)
  const xpThisTrip = Object.values(progress).reduce((sum, v) => sum + (v.xpEarned || 0), 0)

  function isPhaseUnlocked(phase) {
    return phase.id === 1 || weeks <= phase.unlockWeeks
  }

  function getLevelState(levelNum) {
    const p = progress[levelNum]
    const phase = PHASES.find(ph => ph.levels.includes(levelNum))
    const phaseUnlocked = isPhaseUnlocked(phase)
    if (!phaseUnlocked) return 'locked'
    if (p?.complete) return 'complete'
    // Unlock level if previous level in same phase is done OR it's the first in phase
    const phaseIdx = phase.levels.indexOf(levelNum)
    if (phaseIdx === 0) return 'available'
    const prevLevel = phase.levels[phaseIdx - 1]
    if (progress[prevLevel]?.complete) return 'available'
    // First level is always available if phase unlocked
    return phaseIdx === 0 ? 'available' : 'locked_level'
  }

  return (
    <>
      <Head><title>{trip.dest} Journey — SoulScape</title></Head>
      <div style={s.page}>

        {/* ── HEADER ── */}
        <div style={s.header}>
          <button className="btn-back" onClick={() => router.push('/planner')}>← All Trips</button>
          <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
            <h1 style={s.tripName}>{trip.dest}</h1>
            <p style={s.tripMeta}>
              {new Date(trip.travelDate).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
              · {weeks > 0 ? `${weeks}w away` : '🎉 This week!'}
            </p>
          </div>
          <div style={{ width: 70 }} />
        </div>

        {/* ── STATS ROW ── */}
        <div style={s.statsRow}>
          <div style={s.stat}>
            <span style={s.statN}>{xpThisTrip}</span>
            <span style={s.statL}>Trip XP</span>
          </div>
          <div style={s.statCenter}>
            <div style={s.bigProgress}>
              <svg viewBox="0 0 60 60" style={{ width: 60, height: 60 }}>
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="var(--amber)" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 30 30)" />
              </svg>
              <div style={s.bigProgressInner}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--amber)' }}>{pct}%</span>
              </div>
            </div>
            <span style={s.statL}>{done}/20 done</span>
          </div>
          <div style={s.stat}>
            <span style={s.statN}>🔥{streak}</span>
            <span style={s.statL}>Day streak</span>
          </div>
        </div>

        {/* ── PHASE TABS ── */}
        <div style={s.phaseTabs}>
          {PHASES.map(p => {
            const unlocked = isPhaseUnlocked(p)
            const pDone = p.levels.filter(l => progress[l]?.complete).length
            const isActive = activePhase === p.id
            return (
              <button key={p.id} onClick={() => setActivePhase(p.id)} style={{
                ...s.phaseTab,
                background: isActive ? `${p.color}22` : 'var(--ink2)',
                border: `2px solid ${isActive ? p.color : 'rgba(240,235,224,.07)'}`,
                opacity: unlocked ? 1 : 0.4,
              }}>
                <span style={{ fontSize: 20 }}>{p.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? p.color : 'var(--sand)' }}>{p.name}</span>
                <span style={{ fontSize: 10, color: 'var(--mist)' }}>{pDone}/{p.levels.length}</span>
                {!unlocked && <span style={{ fontSize: 10 }}>🔒</span>}
              </button>
            )
          })}
        </div>

        {/* ── LEVEL PATH ── */}
        {PHASES.filter(p => p.id === activePhase).map(phase => {
          const unlocked = isPhaseUnlocked(phase)
          return (
            <div key={phase.id}>
              {!unlocked && (
                <div style={s.lockedMsg}>
                  <span style={{ fontSize: 24 }}>🔒</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)' }}>Phase locked</p>
                    <p style={{ fontSize: 13, color: 'var(--mist)' }}>Unlocks {phase.unlockWeeks} weeks before your trip</p>
                  </div>
                </div>
              )}
              <div style={s.levelPath}>
                {phase.levels.map((levelNum, idx) => {
                  const meta = LEVEL_META[levelNum]
                  const state = getLevelState(levelNum)
                  const isComplete = state === 'complete'
                  const isAvailable = state === 'available'
                  const isLockedLevel = state === 'locked_level' || state === 'locked'
                  const prog = progress[levelNum]
                  const isPerfect = prog?.perfect

                  return (
                    <div key={levelNum} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Connector line */}
                      {idx > 0 && (
                        <div style={{ width: 3, height: 24, background: isComplete ? '#58E87A' : 'rgba(255,255,255,.08)', borderRadius: 100 }} />
                      )}

                      {/* Level node */}
                      <button
                        onClick={() => !isLockedLevel && router.push(`/planner/${tripId}/level/${levelNum}`)}
                        style={{
                          width: '100%', maxWidth: 400,
                          background: isComplete ? 'rgba(88,232,122,.12)' : isAvailable ? `${phase.color}15` : 'var(--ink2)',
                          border: `2px solid ${isComplete ? '#58E87A' : isAvailable ? phase.color : 'rgba(240,235,224,.07)'}`,
                          borderRadius: 18, padding: '16px 18px',
                          cursor: isLockedLevel ? 'default' : 'pointer',
                          opacity: isLockedLevel ? 0.35 : 1,
                          display: 'flex', alignItems: 'center', gap: 16,
                          transition: 'all .2s', position: 'relative',
                        }}
                      >
                        {/* Level icon */}
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                          background: isComplete ? 'rgba(88,232,122,.2)' : isAvailable ? `${phase.color}22` : 'rgba(255,255,255,.04)',
                          border: `2px solid ${isComplete ? '#58E87A' : isAvailable ? phase.color : 'rgba(255,255,255,.08)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                        }}>
                          {isComplete ? '✅' : meta.emoji}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: isComplete ? '#58E87A' : 'var(--sand)', fontFamily: "'DM Sans',sans-serif" }}>
                              {meta.title}
                            </p>
                            {isPerfect && <span style={{ fontSize: 10 }}>⭐</span>}
                          </div>
                          <p style={{ fontSize: 11, color: 'var(--mist)', lineHeight: 1.3 }}>{meta.desc}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                            <span style={{ fontSize: 10, color: phase.color, fontWeight: 600 }}>+{meta.xp} XP</span>
                            <span style={{ fontSize: 10, color: 'var(--mist)', background: 'rgba(255,255,255,.05)', padding: '1px 8px', borderRadius: 100 }}>
                              {meta.game === 'quiz' ? '🎯 Quiz' : meta.game === 'truefalse' ? '⚡ True/False' : meta.game === 'match' ? '🧩 Match' : meta.game === 'flashcard' ? '🃏 Flashcard' : '📝 Fill Blank'}
                            </span>
                          </div>
                        </div>

                        {/* Arrow or XP earned */}
                        {isComplete ? (
                          <span style={{ fontSize: 13, color: '#58E87A', flexShrink: 0 }}>+{prog.xpEarned} XP</span>
                        ) : isAvailable ? (
                          <span style={{ fontSize: 20, color: phase.color, flexShrink: 0 }}>→</span>
                        ) : (
                          <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* ── PHASE UNLOCK INFO ── */}
        <div style={s.unlockInfo}>
          {PHASES.filter(p => !isPhaseUnlocked(p)).slice(0, 2).map(p => (
            <div key={p.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span>{p.emoji}</span>
              <p style={{ fontSize: 12, color: 'var(--mist)' }}>
                <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span> unlocks {p.unlockWeeks}w before travel
              </p>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--ink)', padding: 'max(52px,calc(var(--st)+24px)) 20px max(32px,calc(var(--sb)+16px))', maxWidth: 480, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', marginBottom: 20 },
  tripName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--sand)', marginBottom: 3 },
  tripMeta: { fontSize: 12, color: 'var(--mist)' },
  statsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--ink2)', borderRadius: 16, padding: '16px 20px', marginBottom: 20 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statN: { fontSize: 22, fontWeight: 700, color: 'var(--amber)', fontFamily: "'Cormorant Garamond',serif" },
  statL: { fontSize: 10, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'DM Sans',sans-serif" },
  statCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  bigProgress: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bigProgressInner: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  phaseTabs: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none', marginBottom: 4 },
  phaseTab: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 14px', borderRadius: 14, cursor: 'pointer', flexShrink: 0, minWidth: 76, fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' },
  lockedMsg: { display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '16px 18px', marginBottom: 16 },
  levelPath: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 24 },
  unlockInfo: { display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(240,235,224,.06)' },
}
