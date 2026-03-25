// pages/passport.js
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const TIERS = [
  { n:1,  name:'Dreamer',       icon:'🌱', desc:'Your first step into the world.',            req:1,   type:'visits' },
  { n:2,  name:'Wanderer',      icon:'🎒', desc:'Restlessness has a beautiful address.',       req:3,   type:'visits' },
  { n:3,  name:'Explorer',      icon:'🧭', desc:'Curiosity is your compass.',                 req:7,   type:'visits' },
  { n:4,  name:'Nomad',         icon:'🌄', desc:'No single place can hold you.',              req:12,  type:'visits' },
  { n:5,  name:'Pathfinder',    icon:'⛺', desc:'You find places others overlook.',            req:20,  type:'visits' },
  { n:6,  name:'World Citizen', icon:'🌍', desc:'Three worlds explored.',                     req:3,   type:'worlds' },
  { n:7,  name:'Collector',     icon:'🗺️', desc:'Five types of world.',                        req:5,   type:'worlds' },
  { n:8,  name:'Voyager',       icon:'⛵', desc:'30 destinations and still going.',            req:30,  type:'visits' },
  { n:9,  name:'Seeker',        icon:'🔭', desc:'You travel with your whole self.',            req:40,  type:'visits' },
  { n:10, name:'Globetrotter',  icon:'✈️', desc:'All eight worlds discovered.',               req:8,   type:'worlds' },
  { n:11, name:'Cartographer',  icon:'🗾', desc:'50 places. You could draw the map.',         req:50,  type:'visits' },
  { n:12, name:'Pilgrim',       icon:'🕊️', desc:'Some journeys are for the soul.',            req:75,  type:'visits' },
  { n:13, name:'Legend',        icon:'⭐', desc:'100 places. You are SoulScape royalty.',     req:100, type:'visits' },
  { n:14, name:'Sage',          icon:'🌠', desc:'The world has no more secrets from you.',    req:150, type:'visits' },
  { n:15, name:'SoulScape',     icon:'∞',  desc:'You have become the journey itself.',        req:184, type:'visits' },
]

export default function Passport() {
  const router = useRouter()
  const [visits, setVisits] = useState(0)
  const [worlds, setWorlds] = useState(0)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const psp = JSON.parse(localStorage.getItem('ss_psp_v2') || '[]')
      setVisits(psp.length)
      setWorlds(new Set(psp.map(x => x.cat)).size)
      setHistory([...psp].reverse().slice(0, 20))
    } catch(e) {}
  }, [])

  function getTierStatus(tier) {
    const val = tier.type === 'visits' ? visits : worlds
    return val >= tier.req
  }

  function getCurrentTier() {
    let current = TIERS[0]
    for (const t of TIERS) {
      if (getTierStatus(t)) current = t
    }
    return current
  }

  function getNextTier() {
    for (const t of TIERS) {
      if (!getTierStatus(t)) return t
    }
    return null
  }

  const current = getCurrentTier()
  const next = getNextTier()
  const progress = next ? Math.min(100, Math.round((next.type === 'visits' ? visits : worlds) / next.req * 100)) : 100

  return (
    <>
      <Head><title>Passport — SoulScape</title></Head>
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button className="btn-back" onClick={() => router.push('/')}>← Back</button>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={styles.eyebrow}>✈ SoulScape</p>
            <h1 style={styles.title}>Your Passport</h1>
          </div>
          <div style={{ width: 70 }} />
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[['Places', visits], ['Worlds', worlds], ['Tier', `${current.n}/15`]].map(([label, val]) => (
            <div key={label} style={styles.stat}>
              <div style={styles.statN}>{val}</div>
              <div style={styles.statL}>{label}</div>
            </div>
          ))}
        </div>

        {/* Current rank card */}
        <div style={styles.currentCard}>
          <p style={styles.currentLabel}>Current Rank</p>
          <span style={styles.currentIcon}>{current.icon}</span>
          <h2 style={styles.currentName}>{current.name}</h2>
          <p style={styles.currentDesc}>{current.desc}</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: progress + '%' }} />
          </div>
          <p style={styles.progressTxt}>
            {next
              ? `${next.type === 'visits' ? visits : worlds} / ${next.req} to unlock ${next.name}`
              : 'Maximum rank reached ∞'}
          </p>
        </div>

        {/* All 15 tiers */}
        <p style={styles.sectionLabel}>All Passport Ranks</p>
        <div style={styles.tierGrid}>
          {TIERS.map(tier => {
            const unlocked = getTierStatus(tier)
            const isCurrent = tier.n === current.n
            return (
              <div key={tier.n} style={{ ...styles.tier, ...(unlocked ? styles.tierUnlocked : styles.tierLocked), ...(isCurrent ? styles.tierCurrent : {}) }}>
                {isCurrent && <span style={styles.nowBadge}>NOW</span>}
                <span style={styles.tierIcon}>{tier.icon}</span>
                <span style={styles.tierName}>{tier.name}</span>
                <span style={styles.tierReq}>{tier.req} {tier.type}</span>
              </div>
            )
          })}
        </div>

        {/* Recent history */}
        {history.length > 0 && (
          <>
            <p style={styles.sectionLabel}>Recent Journeys</p>
            <div style={styles.histList}>
              {history.map((item, i) => (
                <div key={i} style={styles.histRow}>
                  <span style={{ fontSize: 20 }}>{item.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={styles.histName}>{item.name}</p>
                    <p style={styles.histSub}>{item.country} · {item.emotion}</p>
                  </div>
                  <span style={styles.histDate}>{new Date(item.ts).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--ink)', padding: 'max(52px,calc(var(--st)+24px)) 20px max(20px,calc(var(--sb)+12px))', maxWidth: 480, margin: '0 auto' },
  topBar: { display: 'flex', alignItems: 'center', marginBottom: 20 },
  eyebrow: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: 'var(--sand)' },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 },
  stat: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.07)', borderRadius: 12, padding: 14, textAlign: 'center' },
  statN: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: 'var(--amber)' },
  statL: { fontSize: 10, color: 'var(--mist)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2, fontFamily: "'DM Sans', sans-serif" },
  currentCard: { background: 'linear-gradient(135deg, #1C2951, #0E1428)', border: '2px solid rgba(212,175,55,.4)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' },
  currentLabel: { fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(212,175,55,.55)', marginBottom: 8, fontFamily: "'DM Sans', sans-serif" },
  currentIcon: { fontSize: 52, display: 'block', marginBottom: 8 },
  currentName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: 'rgba(240,235,215,.95)', marginBottom: 6 },
  currentDesc: { fontSize: 13, color: 'rgba(240,235,215,.55)', lineHeight: 1.6, marginBottom: 14 },
  progressBar: { height: 4, background: 'rgba(255,255,255,.1)', borderRadius: 100, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', background: 'linear-gradient(to right, rgba(212,175,55,.8), var(--amber))', borderRadius: 100, transition: 'width .8s ease' },
  progressTxt: { fontSize: 12, color: 'var(--mist)' },
  sectionLabel: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(232,146,74,.55)', marginBottom: 12, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" },
  tierGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 },
  tier: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.07)', borderRadius: 12, padding: '12px 8px', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  tierUnlocked: { borderColor: 'rgba(212,175,55,.3)', cursor: 'pointer' },
  tierLocked: { opacity: .38 },
  tierCurrent: { borderColor: 'var(--amber)', boxShadow: '0 0 18px rgba(232,146,74,.2)' },
  nowBadge: { position: 'absolute', top: -7, right: -5, background: 'var(--amber)', color: 'var(--ink)', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 100, fontFamily: "'DM Sans', sans-serif" },
  tierIcon: { fontSize: 24 },
  tierName: { fontSize: 10, color: 'var(--sand)', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  tierReq: { fontSize: 9, color: 'var(--mist)', fontFamily: "'DM Sans', sans-serif" },
  histList: { display: 'flex', flexDirection: 'column', gap: 8 },
  histRow: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.07)', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12 },
  histName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: 'var(--sand)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  histSub: { fontSize: 11, color: 'var(--mist)' },
  histDate: { fontSize: 10, color: 'var(--amber)', flexShrink: 0 },
}
