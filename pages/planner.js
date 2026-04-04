// pages/planner.js — Trip list with fixed month picker
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DESTINATIONS, CATS } from '../data/destinations'
import { LEVEL_META } from './api/planner'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const now = new Date()
// Generate next 24 months as options
function getFutureMonths() {
  const opts = []
  for (let i = 1; i <= 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    opts.push({
      label: MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
      value: MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
      month: MONTHS[d.getMonth()],
      year: d.getFullYear(),
    })
  }
  return opts
}

export default function Planner() {
  const router = useRouter()
  const [trips, setTrips] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [dest, setDest] = useState(null)
  const [destSearch, setDestSearch] = useState('')
  const [destResults, setDestResults] = useState([])
  const [travelMonth, setTravelMonth] = useState('')
  const [homecity, setHomecity] = useState('')
  const [progress, setProgress] = useState({})
  const futureMonths = getFutureMonths()

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('ss_trips') || '[]')
    setTrips(t)
    const p = {}
    t.forEach(trip => {
      const stored = JSON.parse(localStorage.getItem('ss_course_' + trip.id) || 'null')
      const done = stored?.levels?.filter(l => l.complete)?.length || 0
      p[trip.id] = { done, pct: Math.round(done / 9 * 100) }
    })
    setProgress(p)
    setHomecity(localStorage.getItem('ss_city') || '')
  }, [])

  function searchDest(q) {
    setDestSearch(q)
    if (q.length < 2) { setDestResults([]); return }
    setDestResults(DESTINATIONS.filter(d => d.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6))
  }

  function selectDest(d) {
    setDest(d)
    setDestSearch(d.name)
    setDestResults([])
  }

  function addTrip() {
    if (!dest) { alert('Please pick a destination'); return }
    if (!travelMonth) { alert('Please pick your travel month'); return }
    const trip = {
      id: Date.now().toString(),
      dest: dest.name,
      country: dest.country,
      cat: dest.cat,
      travelMonth,
      homecity: homecity.trim(),
      createdAt: new Date().toISOString(),
    }
    const updated = [...trips, trip]
    setTrips(updated)
    localStorage.setItem('ss_trips', JSON.stringify(updated))
    localStorage.setItem('ss_city', homecity.trim())
    setShowNew(false)
    setDest(null); setDestSearch(''); setTravelMonth('')
    router.push('/planner/' + trip.id)
  }

  function deleteTrip(id, e) {
    e.stopPropagation()
    if (!confirm('Remove this trip?')) return
    const updated = trips.filter(t => t.id !== id)
    setTrips(updated)
    localStorage.setItem('ss_trips', JSON.stringify(updated))
    localStorage.removeItem('ss_course_' + id)
  }

  return (
    <>
      <Head><title>Pre-Trip Planner — SoulScape</title></Head>
      <div style={s.page}>

        <div style={s.header}>
          <button className="btn-back" onClick={() => router.push('/')}>← Back</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={s.eyebrow}>✈️ SoulScape</p>
            <h1 style={s.title}>Pre-Trip Planner</h1>
            <p style={s.sub}>9 levels · 110 questions · destination-specific</p>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Existing trips */}
        {trips.map(trip => {
          const prog = progress[trip.id] || { done: 0, pct: 0 }
          return (
            <div key={trip.id} style={s.tripCard} onClick={() => router.push('/planner/' + trip.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={s.tripName}>{trip.dest}</h3>
                  <p style={s.tripMeta}>{trip.country} · {trip.travelMonth}</p>
                </div>
                <button onClick={e => deleteTrip(trip.id, e)} style={s.delBtn}>✕</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <div style={s.progBar}><div style={{ ...s.progFill, width: prog.pct + '%' }} /></div>
                <span style={{ fontSize: 11, color: 'var(--mist)', whiteSpace: 'nowrap' }}>{prog.done}/9 levels</span>
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {trips.length === 0 && !showNew && (
          <div style={{ textAlign: 'center', padding: '40px 0 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🧳</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: 'var(--sand)', marginBottom: 10 }}>Plan your next trip</h2>
            <p style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.7, maxWidth: 300, margin: '0 auto' }}>
              110 destination-specific questions across 9 levels — geography, transit, language, culture, food, money and more.
            </p>
          </div>
        )}

        {/* Add trip form */}
        {showNew ? (
          <div style={s.form}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--sand)', marginBottom: 18 }}>Plan a new trip</h3>

            <label style={s.lbl}>Where are you going?</label>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input style={s.inp} placeholder="Search destinations..." value={destSearch}
                onChange={e => searchDest(e.target.value)} autoFocus />
              {destResults.length > 0 && (
                <div style={s.drop}>
                  {destResults.map(d => (
                    <button key={d.name} style={s.dropItem} onClick={() => selectDest(d)}>
                      <span>{CATS[d.cat]?.emoji}</span>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: 14, color: 'var(--sand)', fontWeight: 600, margin: 0 }}>{d.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--mist)', margin: 0 }}>{d.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {dest && <p style={{ fontSize: 12, color: 'var(--amber)', marginBottom: 14, marginTop: -8 }}>✓ {dest.name}, {dest.country}</p>}

            <label style={s.lbl}>When are you travelling?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {futureMonths.map(m => (
                <button key={m.value} onClick={() => setTravelMonth(m.value)} style={{
                  padding: '8px 14px', borderRadius: 100, fontSize: 13, cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif",
                  border: `2px solid ${travelMonth === m.value ? 'var(--amber)' : 'rgba(240,235,224,.1)'}`,
                  background: travelMonth === m.value ? 'rgba(232,146,74,.18)' : 'var(--ink2)',
                  color: travelMonth === m.value ? 'var(--amber)' : 'var(--mist)',
                  fontWeight: travelMonth === m.value ? 700 : 400,
                }}>
                  {m.label}
                </button>
              ))}
            </div>

            <label style={s.lbl}>Your home city (for flight context)</label>
            <input style={{ ...s.inp, marginBottom: 18 }} placeholder="e.g. Mumbai, India"
              value={homecity} onChange={e => setHomecity(e.target.value)} />

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={addTrip}
                disabled={!dest || !travelMonth}>
                Generate My Course →
              </button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setShowNew(false); setDest(null); setDestSearch(''); setTravelMonth('') }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="btn-primary" style={{ width: '100%', padding: '16px 0', marginTop: trips.length ? 16 : 0 }} onClick={() => setShowNew(true)}>
            + Plan a New Trip
          </button>
        )}

        {/* Level overview */}
        {!showNew && (
          <div style={{ borderTop: '1px solid rgba(240,235,224,.06)', paddingTop: 24, marginTop: 24 }}>
            <p style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(232,146,74,.45)', textAlign: 'center', marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>
              9 levels · 110 questions
            </p>
            {LEVEL_META.map(l => (
              <div key={l.level} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{l.emoji}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--sand)', margin: 0 }}>Level {l.level}: {l.theme}</p>
                  <p style={{ fontSize: 11, color: 'var(--mist)', margin: 0 }}>{l.desc}</p>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--amber)', background: 'rgba(232,146,74,.08)', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>+{l.xp} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--ink)', padding: 'max(52px,calc(var(--st)+24px)) 20px max(32px,calc(var(--sb)+16px))', maxWidth: 520, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', marginBottom: 28 },
  eyebrow: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 4, fontFamily: "'DM Sans',sans-serif" },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: 'var(--sand)', marginBottom: 4 },
  sub: { fontSize: 12, color: 'var(--mist)' },
  tripCard: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.08)', borderRadius: 14, padding: 16, cursor: 'pointer', marginBottom: 12 },
  tripName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: 'var(--sand)', marginBottom: 3 },
  tripMeta: { fontSize: 12, color: 'var(--mist)' },
  delBtn: { background: 'transparent', border: 'none', color: 'rgba(154,136,120,.4)', fontSize: 14, cursor: 'pointer', padding: '0 4px' },
  progBar: { flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 100, overflow: 'hidden' },
  progFill: { height: '100%', background: 'linear-gradient(to right,rgba(232,146,74,.8),var(--amber))', borderRadius: 100, transition: 'width .6s' },
  form: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.08)', borderRadius: 14, padding: 20, marginBottom: 20 },
  lbl: { display: 'block', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 8, fontFamily: "'DM Sans',sans-serif" },
  inp: { width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(240,235,224,.12)', borderRadius: 8, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--sand)', outline: 'none', boxSizing: 'border-box', display: 'block' },
  drop: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#1A1630', border: '1px solid rgba(240,235,224,.1)', borderRadius: 10, zIndex: 50, overflow: 'hidden', marginTop: 4 },
  dropItem: { display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer' },
}
