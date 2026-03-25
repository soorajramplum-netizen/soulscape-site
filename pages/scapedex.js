// pages/scapedex.js
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DESTINATIONS, CATS, slugify } from '../data/destinations'

export default function ScapeDex() {
  const router = useRouter()
  const [visited, setVisited] = useState(new Set())
  const [selected, setSelected] = useState(null)
  const [facts, setFacts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    try {
      const dex = new Set(JSON.parse(localStorage.getItem('ss_dex_v1') || '[]'))
      setVisited(dex)
    } catch(e) {}
  }, [])

  async function openDest(dest) {
    setSelected(dest)
    setFacts(null)
    setLoading(true)
    try {
      const res = await fetch('/api/dexfacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destName: dest.name, destCountry: dest.country }),
      })
      setFacts(await res.json())
    } catch(e) {}
    setLoading(false)
  }

  const filtered = filter === 'all' ? DESTINATIONS
    : filter === 'unlocked' ? DESTINATIONS.filter(d => visited.has(d.name))
    : DESTINATIONS.filter(d => d.cat === filter)

  return (
    <>
      <Head><title>ScapeDex — SoulScape</title></Head>
      <div style={styles.page}>
        <div style={styles.header}>
          <button className="btn-back" onClick={() => router.push('/')}>← Back</button>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={styles.eyebrow}>📖 ScapeDex</p>
            <h1 style={styles.title}>Your Collection</h1>
            <p style={styles.progress}>{visited.size} / {DESTINATIONS.length} discovered</p>
          </div>
          <div style={{ width: 70 }} />
        </div>

        {/* Filter pills */}
        <div style={styles.pills}>
          {[['all','🌍 All'],['unlocked','✅ Found'],...Object.entries(CATS).map(([k,c])=>[k,c.emoji+' '+c.name])].map(([key, label]) => (
            <button key={key} style={{ ...styles.pill, ...(filter === key ? styles.pillActive : {}) }} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {filtered.map((dest, i) => {
            const unlocked = visited.has(dest.name)
            return (
              <button
                key={dest.name}
                style={{ ...styles.card, ...(unlocked ? styles.cardUnlocked : styles.cardLocked) }}
                onClick={() => unlocked && openDest(dest)}
              >
                <span style={styles.cardNum}>#{DESTINATIONS.indexOf(dest) + 1}</span>
                <span style={styles.cardEm}>{CATS[dest.cat].emoji}</span>
                <span style={styles.cardName}>{unlocked ? dest.name : '???'}</span>
              </button>
            )
          })}
        </div>

        {/* Detail modal */}
        {selected && (
          <div style={styles.modal}>
            <div style={styles.modalCard}>
              <button className="btn-back" style={{ marginBottom: 20 }} onClick={() => setSelected(null)}>← Back</button>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 56 }}>{CATS[selected.cat].emoji}</span>
                <h2 style={styles.modalName}>{selected.name}</h2>
                <p style={styles.modalCountry}>{selected.country} · {CATS[selected.cat].name}</p>
              </div>
              {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner" /></div>}
              {facts && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    ['Famous Story', facts.story],
                    ['Did You Know', facts.fact],
                    ['Best Time to Visit', facts.bestTime],
                    ['Culinary Special', facts.cuisine],
                    ['Hidden Gem', facts.hiddenGem],
                    ['Local Word', facts.localWord],
                  ].map(([label, val]) => val && (
                    <div key={label} style={styles.factRow}>
                      <p style={styles.factLabel}>{label}</p>
                      <p style={styles.factVal}>{val}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="btn-primary"
                style={{ marginTop: 20, width: '100%' }}
                onClick={() => router.push('/place/' + slugify(selected.name))}
              >
                Visit this place →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--ink)', padding: 'max(52px,calc(var(--st)+24px)) 16px max(20px,calc(var(--sb)+12px))', maxWidth: 600, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  eyebrow: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: 'var(--sand)', marginBottom: 2 },
  progress: { fontSize: 13, color: 'var(--mist)' },
  pills: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' },
  pill: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.08)', color: 'rgba(240,232,214,.5)', padding: '7px 13px', borderRadius: 100, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" },
  pillActive: { background: 'rgba(232,146,74,.18)', borderColor: 'var(--amber)', color: 'var(--amber)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 },
  card: { background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.07)', borderRadius: 10, padding: '10px 6px', textAlign: 'center', position: 'relative', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  cardUnlocked: { borderColor: 'rgba(232,146,74,.25)', cursor: 'pointer' },
  cardLocked: { opacity: .35 },
  cardNum: { position: 'absolute', top: 5, right: 6, fontSize: 8, color: 'rgba(240,235,224,.25)' },
  cardEm: { fontSize: 22 },
  cardName: { fontSize: 9, color: 'rgba(240,235,224,.6)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  modal: { position: 'fixed', inset: 0, zIndex: 50, background: '#0A0812', overflowY: 'auto', padding: 'max(52px,calc(var(--st)+24px)) 22px max(32px,calc(var(--sb)+20px))' },
  modalCard: { maxWidth: 500, margin: '0 auto' },
  modalName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: 'var(--sand)', marginTop: 8, marginBottom: 4 },
  modalCountry: { fontSize: 13, color: 'var(--mist)' },
  factRow: { background: 'var(--ink2)', borderRadius: 10, padding: '12px 14px' },
  factLabel: { fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 5, fontFamily: "'DM Sans', sans-serif" },
  factVal: { fontSize: 14, color: 'rgba(240,235,224,.8)', lineHeight: 1.6 },
}
