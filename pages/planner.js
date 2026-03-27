// pages/planner.js
// Trip list — shows all pinned trips, lets you add new ones

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DESTINATIONS, CATS, slugify } from '../data/destinations'
import { PHASES, LEVEL_META } from './api/planner'

function weeksUntil(dateStr) {
  const d = new Date(dateStr)
  return Math.round((d - Date.now()) / (1000 * 60 * 60 * 24 * 7))
}

function getPhaseUnlock(trip) {
  const weeks = weeksUntil(trip.travelDate)
  return PHASES.filter(p => weeks <= p.unlockWeeks || p.id === 1)
}

function getLevelProgress(trip) {
  const storage = JSON.parse(localStorage.getItem('ss_planner_' + trip.id) || '{}')
  const done = Object.values(storage).filter(v => v.complete).length
  return { done, total: 20, pct: Math.round(done / 20 * 100) }
}

export default function Planner() {
  const router = useRouter()
  const [trips, setTrips] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [newTrip, setNewTrip] = useState({ dest: '', country: '', travelDate: '', homecity: '', days: 7 })
  const [destSearch, setDestSearch] = useState('')
  const [destResults, setDestResults] = useState([])
  const [progress, setProgress] = useState({})

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('ss_trips') || '[]')
    setTrips(t)
    const p = {}
    t.forEach(trip => {
      const storage = JSON.parse(localStorage.getItem('ss_planner_' + trip.id) || '{}')
      const done = Object.values(storage).filter(v => v.complete).length
      p[trip.id] = { done, pct: Math.round(done / 20 * 100) }
    })
    setProgress(p)
    const city = localStorage.getItem('ss_city') || ''
    setNewTrip(prev => ({ ...prev, homecity: city }))
  }, [])

  function searchDest(q) {
    setDestSearch(q)
    if (q.length < 2) { setDestResults([]); return }
    setDestResults(DESTINATIONS.filter(d => d.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6))
  }

  function selectDest(d) {
    setNewTrip(prev => ({ ...prev, dest: d.name, country: d.country }))
    setDestSearch(d.name)
    setDestResults([])
  }

  function addTrip() {
    if (!newTrip.dest || !newTrip.travelDate) {
      alert('Please select a destination and travel date')
      return
    }
    const trip = {
      id: Date.now().toString(),
      ...newTrip,
      createdAt: new Date().toISOString(),
    }
    const updated = [...trips, trip]
    setTrips(updated)
    localStorage.setItem('ss_trips', JSON.stringify(updated))
    localStorage.setItem('ss_city', newTrip.homecity)
    setShowNew(false)
    setNewTrip({ dest: '', country: '', travelDate: '', homecity: newTrip.homecity, days: 7 })
    setDestSearch('')
    router.push('/planner/' + trip.id)
  }

  function deleteTrip(id) {
    if (!confirm('Remove this trip?')) return
    const updated = trips.filter(t => t.id !== id)
    setTrips(updated)
    localStorage.setItem('ss_trips', JSON.stringify(updated))
    localStorage.removeItem('ss_planner_' + id)
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 7)

  return (
    <>
      <Head><title>Pre-Trip Planner — SoulScape</title></Head>
      <div style={s.page}>

        <div style={s.header}>
          <button className="btn-back" onClick={() => router.push('/')}>← Back</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={s.eyebrow}>🗺️ SoulScape</p>
            <h1 style={s.title}>Pre-Trip Planner</h1>
            <p style={s.sub}>20 levels of prep. For travellers who want to arrive ready.</p>
          </div>
          <div style={{ width: 70 }} />
        </div>

        {/* Trip list */}
        {trips.length > 0 && (
          <div style={s.tripList}>
            {trips.map(trip => {
              const weeks = weeksUntil(trip.travelDate)
              const prog = progress[trip.id] || { done: 0, pct: 0 }
              const phasesUnlocked = PHASES.filter(p => p.id === 1 || weeks <= p.unlockWeeks).length
              return (
                <div key={trip.id} style={s.tripCard} onClick={() => router.push('/planner/' + trip.id)}>
                  <div style={s.tripTop}>
                    <div>
                      <h3 style={s.tripDest}>{trip.dest}</h3>
                      <p style={s.tripMeta}>{trip.country} · {new Date(trip.travelDate).toLocaleDateString('en', { month: 'long', year: 'numeric' })} · {trip.days} days</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ ...s.weeksBadge, background: weeks < 4 ? 'rgba(232,146,74,.2)' : 'rgba(123,108,176,.15)', color: weeks < 4 ? 'var(--amber)' : 'var(--violet)' }}>
                        {weeks > 0 ? `${weeks}w away` : 'This week!'}
                      </span>
                      <button style={s.deleteBtn} onClick={e => { e.stopPropagation(); deleteTrip(trip.id) }}>✕</button>
                    </div>
                  </div>
                  <div style={s.progRow}>
                    <div style={s.progBar}><div style={{ ...s.progFill, width: prog.pct + '%' }} /></div>
                    <span style={s.progTxt}>{prog.done}/20 levels</span>
                  </div>
                  <div style={s.phasePills}>
                    {PHASES.map(p => {
                      const unlocked = p.id === 1 || weeks <= p.unlockWeeks
                      return (
                        <span key={p.id} style={{ ...s.phasePill, opacity: unlocked ? 1 : 0.3 }}>
                          {p.emoji} {p.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {trips.length === 0 && !showNew && (
          <div style={s.emptyState}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✈️</div>
            <h2 style={s.emptyTitle}>Pin your first trip</h2>
            <p style={s.emptySub}>Tell us where you're going. We'll build you a 20-level prep journey — language, culture, food, budget, hidden gems and more.</p>
          </div>
        )}

        {/* Add trip form */}
        {showNew ? (
          <div style={s.form}>
            <h3 style={s.formTitle}>Pin a new trip</h3>

            {/* Destination search */}
            <label style={s.label}>Destination</label>
            <div style={{ position: 'relative' }}>
              <input
                style={s.input}
                placeholder="Search destinations..."
                value={destSearch}
                onChange={e => searchDest(e.target.value)}
                autoFocus
              />
              {destResults.length > 0 && (
                <div style={s.dropdown}>
                  {destResults.map(d => (
                    <button key={d.name} style={s.dropItem} onClick={() => selectDest(d)}>
                      <span>{CATS[d.cat].emoji}</span>
                      <div>
                        <p style={{ fontSize: 14, color: 'var(--sand)', fontWeight: 600 }}>{d.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--mist)' }}>{d.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {newTrip.dest && (
              <p style={{ fontSize: 12, color: 'var(--amber)', marginTop: 4, marginBottom: 12 }}>✓ {newTrip.dest}, {newTrip.country}</p>
            )}

            <label style={s.label}>Travel Month</label>
            <input
              type="month"
              style={s.input}
              min={minDate.toISOString().slice(0, 7)}
              value={newTrip.travelDate}
              onChange={e => setNewTrip(prev => ({ ...prev, travelDate: e.target.value + '-01' }))}
            />

            <label style={s.label}>Your Home City</label>
            <input
              style={s.input}
              placeholder="e.g. Mumbai, India"
              value={newTrip.homecity}
              onChange={e => setNewTrip(prev => ({ ...prev, homecity: e.target.value }))}
            />

            <label style={s.label}>Trip Duration (days)</label>
            <input
              type="number"
              style={s.input}
              min={1} max={60}
              value={newTrip.days}
              onChange={e => setNewTrip(prev => ({ ...prev, days: parseInt(e.target.value) || 7 }))}
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={addTrip}>Start Planning →</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="btn-primary" style={s.addBtn} onClick={() => setShowNew(true)}>
            + Pin a New Trip
          </button>
        )}

        {/* How it works */}
        {!showNew && (
          <div style={s.howItWorks}>
            <p style={s.howTitle}>20 levels across 5 phases</p>
            <div style={s.phases}>
              {PHASES.map(p => (
                <div key={p.id} style={s.phaseItem}>
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--sand)' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--mist)' }}>
                      {p.levels.length} levels · unlocks {p.unlockWeeks}w before
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--ink)', padding: 'max(52px,calc(var(--st)+24px)) 20px max(32px,calc(var(--sb)+16px))', maxWidth: 520, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', marginBottom: 24 },
  eyebrow: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 4, fontFamily: "'DM Sans',sans-serif" },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: 'var(--sand)', marginBottom: 4 },
  sub: { fontSize: 13, color: 'var(--mist)', lineHeight: 1.5 },
  tripList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  tripCard: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.08)', borderRadius: 14, padding: 16, cursor: 'pointer', transition: 'border-color .2s' },
  tripTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  tripDest: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: 'var(--sand)', marginBottom: 3 },
  tripMeta: { fontSize: 12, color: 'var(--mist)' },
  weeksBadge: { fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100, letterSpacing: 1, fontFamily: "'DM Sans',sans-serif" },
  deleteBtn: { background: 'transparent', border: 'none', color: 'rgba(154,136,120,.4)', fontSize: 14, cursor: 'pointer', padding: 4 },
  progRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  progBar: { flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 100, overflow: 'hidden' },
  progFill: { height: '100%', background: 'linear-gradient(to right,rgba(232,146,74,.8),var(--amber))', borderRadius: 100, transition: 'width .6s ease' },
  progTxt: { fontSize: 10, color: 'var(--mist)', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif" },
  phasePills: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  phasePill: { fontSize: 10, color: 'var(--mist)', background: 'rgba(255,255,255,.04)', padding: '3px 10px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif" },
  emptyState: { textAlign: 'center', padding: '32px 0 24px' },
  emptyTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--sand)', marginBottom: 10 },
  emptySub: { fontSize: 14, color: 'var(--mist)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' },
  form: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.08)', borderRadius: 14, padding: 20, marginBottom: 20 },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: 'var(--sand)', marginBottom: 16 },
  label: { display: 'block', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 6, fontFamily: "'DM Sans',sans-serif" },
  input: { width: '100%', background: 'var(--ink3)', border: '1px solid rgba(240,235,224,.12)', borderRadius: 8, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--sand)', outline: 'none', marginBottom: 14, display: 'block', boxSizing: 'border-box' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#1A1630', border: '1px solid rgba(240,235,224,.1)', borderRadius: 10, zIndex: 50, overflow: 'hidden', marginTop: 4 },
  dropItem: { display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', fontSize: 14, textAlign: 'left' },
  addBtn: { width: '100%', marginBottom: 28, padding: '16px 0' },
  howItWorks: { borderTop: '1px solid rgba(240,235,224,.06)', paddingTop: 24 },
  howTitle: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(232,146,74,.5)', marginBottom: 16, fontFamily: "'DM Sans',sans-serif", textAlign: 'center' },
  phases: { display: 'flex', flexDirection: 'column', gap: 12 },
  phaseItem: { display: 'flex', gap: 14, alignItems: 'center' },
}
