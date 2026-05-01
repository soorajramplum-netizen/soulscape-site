// pages/place/[id].js
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CATS, getDestinationById } from '../../data/destinations'

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY || ''

const COUNTRIES = [
  {name:'India',flag:'🇮🇳',currency:'INR',symbol:'₹',rate:83.5},
  {name:'United States',flag:'🇺🇸',currency:'USD',symbol:'$',rate:1},
  {name:'United Kingdom',flag:'🇬🇧',currency:'GBP',symbol:'£',rate:0.79},
  {name:'United Arab Emirates',flag:'🇦🇪',currency:'AED',symbol:'AED ',rate:3.67},
  {name:'Singapore',flag:'🇸🇬',currency:'SGD',symbol:'SGD ',rate:1.34},
  {name:'Australia',flag:'🇦🇺',currency:'AUD',symbol:'A$',rate:1.55},
  {name:'Canada',flag:'🇨🇦',currency:'CAD',symbol:'C$',rate:1.36},
  {name:'Germany',flag:'🇩🇪',currency:'EUR',symbol:'€',rate:0.92},
  {name:'France',flag:'🇫🇷',currency:'EUR',symbol:'€',rate:0.92},
  {name:'Japan',flag:'🇯🇵',currency:'JPY',symbol:'¥',rate:149},
  {name:'China',flag:'🇨🇳',currency:'CNY',symbol:'¥',rate:7.24},
  {name:'South Korea',flag:'🇰🇷',currency:'KRW',symbol:'₩',rate:1330},
  {name:'Brazil',flag:'🇧🇷',currency:'BRL',symbol:'R$',rate:4.97},
  {name:'South Africa',flag:'🇿🇦',currency:'ZAR',symbol:'R',rate:18.6},
  {name:'Nigeria',flag:'🇳🇬',currency:'NGN',symbol:'₦',rate:1550},
  {name:'Egypt',flag:'🇪🇬',currency:'EGP',symbol:'E£',rate:30.9},
  {name:'Saudi Arabia',flag:'🇸🇦',currency:'SAR',symbol:'SR',rate:3.75},
  {name:'Turkey',flag:'🇹🇷',currency:'TRY',symbol:'₺',rate:32.1},
  {name:'Mexico',flag:'🇲🇽',currency:'MXN',symbol:'MX$',rate:17.1},
  {name:'Indonesia',flag:'🇮🇩',currency:'IDR',symbol:'Rp',rate:15800},
  {name:'Malaysia',flag:'🇲🇾',currency:'MYR',symbol:'RM',rate:4.72},
  {name:'Thailand',flag:'🇹🇭',currency:'THB',symbol:'฿',rate:35.1},
  {name:'Philippines',flag:'🇵🇭',currency:'PHP',symbol:'₱',rate:56.5},
  {name:'Pakistan',flag:'🇵🇰',currency:'PKR',symbol:'Rs',rate:278},
  {name:'Bangladesh',flag:'🇧🇩',currency:'BDT',symbol:'৳',rate:110},
  {name:'Sri Lanka',flag:'🇱🇰',currency:'LKR',symbol:'Rs',rate:305},
  {name:'Nepal',flag:'🇳🇵',currency:'NPR',symbol:'Rs',rate:133},
  {name:'New Zealand',flag:'🇳🇿',currency:'NZD',symbol:'NZ$',rate:1.63},
  {name:'Switzerland',flag:'🇨🇭',currency:'CHF',symbol:'CHF ',rate:0.89},
  {name:'Sweden',flag:'🇸🇪',currency:'SEK',symbol:'kr',rate:10.4},
  {name:'Norway',flag:'🇳🇴',currency:'NOK',symbol:'kr',rate:10.7},
  {name:'Denmark',flag:'🇩🇰',currency:'DKK',symbol:'kr',rate:6.88},
  {name:'Netherlands',flag:'🇳🇱',currency:'EUR',symbol:'€',rate:0.92},
  {name:'Spain',flag:'🇪🇸',currency:'EUR',symbol:'€',rate:0.92},
  {name:'Italy',flag:'🇮🇹',currency:'EUR',symbol:'€',rate:0.92},
  {name:'Portugal',flag:'🇵🇹',currency:'EUR',symbol:'€',rate:0.92},
  {name:'Greece',flag:'🇬🇷',currency:'EUR',symbol:'€',rate:0.92},
  {name:'Poland',flag:'🇵🇱',currency:'PLN',symbol:'zł',rate:3.97},
  {name:'Russia',flag:'🇷🇺',currency:'RUB',symbol:'₽',rate:91.2},
  {name:'Kenya',flag:'🇰🇪',currency:'KES',symbol:'KSh',rate:130},
  {name:'Morocco',flag:'🇲🇦',currency:'MAD',symbol:'DH',rate:10.1},
  {name:'Argentina',flag:'🇦🇷',currency:'ARS',symbol:'$',rate:870},
  {name:'Vietnam',flag:'🇻🇳',currency:'VND',symbol:'₫',rate:24500},
]

export default function Place() {
  const router = useRouter()
  const { id } = router.query
  const [dest, setDest] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [priceData, setPriceData] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [cuisine, setCuisine] = useState(null)
  const [cuisineLoading, setCuisineLoading] = useState(false)
  const [phrasebook, setPhrasebook] = useState(null)
  const [phraseLoading, setPhraseLoading] = useState(false)
  const [originInput, setOriginInput] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDrop, setShowCountryDrop] = useState(false)
  const [tripDays, setTripDays] = useState(7)

  useEffect(() => {
    if (!id) return
    const d = getDestinationById(id)
    if (!d) { router.push('/'); return }
    setDest(d)
    stampVisit(d)
    const savedCity = localStorage.getItem('ss_city') || ''
    setOriginInput(savedCity)
    const savedCountry = localStorage.getItem('ss_country')
    if (savedCountry) {
      const c = COUNTRIES.find(c => c.name === savedCountry)
      if (c) { setSelectedCountry(c); setCountrySearch(c.flag + ' ' + c.name) }
    }
    fetchVideo(d)
  }, [id])

  function stampVisit(d) {
    try {
      const emotion = sessionStorage.getItem('ss_emotion') || 'exploring'
      sessionStorage.removeItem('ss_emotion')
      sessionStorage.removeItem('ss_sentence')
      const psp = JSON.parse(localStorage.getItem('ss_psp_v2') || '[]')
      psp.push({ name: d.name, country: d.country, cat: d.cat, emotion, ts: Date.now(), emoji: CATS[d.cat].emoji })
      if (psp.length > 60) psp.splice(0, psp.length - 60)
      localStorage.setItem('ss_psp_v2', JSON.stringify(psp))
      const dex = new Set(JSON.parse(localStorage.getItem('ss_dex_v1') || '[]'))
      dex.add(d.name)
      localStorage.setItem('ss_dex_v1', JSON.stringify([...dex]))
    } catch(e) {}
  }

  async function fetchVideo(d) {
    if (!PEXELS_KEY) return
    const h = d.name.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
    for (const q of [d.q1, d.q2, CATS[d.cat].name + ' aerial drone cinematic landscape']) {
      try {
        const r = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=10&page=${(h%4)+1}&min_duration=5`,
          { headers: { Authorization: PEXELS_KEY } }
        )
        if (!r.ok) continue
        const data = await r.json()
        const real = (data.videos||[]).filter(v => v.video_files?.some(f => f.link?.includes('.mp4') && f.width >= 640))
        if (!real.length) continue
        const v = real[(h%10) % real.length]
        const files = v.video_files.filter(f => f.link?.includes('.mp4') && f.width >= 640).sort((a,b) => b.width - a.width)
        const f = files.find(f => f.width >= 1280 && f.width <= 1920) || files[0]
        if (f) { setVideoUrl(f.link); break }
      } catch(e) { continue }
    }
  }

  function openModal(type) {
    setActiveModal(type)
    if (type === 'cuisine' && !cuisine) loadCuisine()
    if (type === 'speak' && !phrasebook) loadPhrasebook()
  }

  async function loadPrices() {
    if (!selectedCountry) { alert('Please select your country first'); return }
    const cityText = countrySearch.replace(selectedCountry.flag, '').trim()
    const cityPart = originInput.trim() || cityText || selectedCountry.name
    const originCity = cityPart.includes(selectedCountry.name) ? cityPart : cityPart + ', ' + selectedCountry.name
    localStorage.setItem('ss_city', originCity)
    localStorage.setItem('ss_country', selectedCountry.name)
    setPriceLoading(true)
    setPriceData(null)
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destName: dest.name,
          destCountry: dest.country,
          destLat: dest.lat,
          destLng: dest.lng,
          originCity,
          tripDays,
          originCurrency: selectedCountry.currency,
        }),
      })
      setPriceData(await res.json())
    } catch(e) {
      setPriceData({ error: 'Connection error. Please try again.' })
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
    } catch(e) { setCuisine({ error: 'Could not load cuisine data.' }) }
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
    } catch(e) { setPhrasebook({ error: 'Could not load phrase data.' }) }
    setPhraseLoading(false)
  }

  if (!dest) return <div style={{ background: '#0A0812', minHeight: '100vh' }} />
  const cat = CATS[dest.cat]

  return (
    <>
      <Head><title>{dest.name} — SoulScape</title></Head>

      <div style={{ position: 'fixed', inset: 0, background: '#060810', overflow: 'hidden' }}>

        {/* Full screen video */}
        {videoUrl && (
          <video src={videoUrl} autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Top gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to bottom, rgba(0,0,0,.7) 0%, transparent 100%)', zIndex: 2 }} />

        {/* Bottom gradient — strong enough to read text */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to top, rgba(6,4,12,.98) 0%, rgba(6,4,12,.88) 35%, rgba(6,4,12,.5) 60%, transparent 100%)', zIndex: 2 }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 'max(14px,calc(var(--st)+8px))', left: 14, right: 14, zIndex: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => router.push('/')} style={{
            background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,.18)', color: 'rgba(255,255,255,.9)',
            padding: '8px 16px', borderRadius: 100, fontSize: 13, cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif",
          }}>🏠 Home</button>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 16,
            color: 'rgba(255,255,255,.85)', textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>SoulScape</span>
          <span style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.14)', color: 'rgba(255,255,255,.7)',
            padding: '5px 12px', borderRadius: 100, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
            {cat.emoji} {cat.name}
          </span>
        </div>

        {/* Bottom info + buttons */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          padding: '0 20px max(20px,calc(var(--sb)+14px))' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)',
              fontFamily: "'DM Sans',sans-serif" }}>{dest.country}</span>
            <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 9 }}>·</span>
            <span style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)',
              fontFamily: "'DM Sans',sans-serif" }}>{cat.name}</span>
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(30px,8vw,54px)', fontWeight: 700, color: '#fff',
            lineHeight: 1, letterSpacing: -1, marginBottom: 8,
            textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>{dest.name}</h1>

          {/* Desc */}
          <p style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(14px,3.5vw,17px)', fontStyle: 'italic',
            color: 'rgba(255,255,255,.6)', lineHeight: 1.5, marginBottom: 20,
            maxWidth: 480, textShadow: '0 1px 8px rgba(0,0,0,.7)' }}>{dest.desc}</p>

          {/* Primary actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            {[
              { label: '✈ Prices',   type: 'prices',   color: '#E8924A', bg: 'rgba(232,146,74,.2)'  },
              { label: '🍽 Cuisine', type: 'cuisine',  color: '#FF85C0', bg: 'rgba(255,133,192,.18)' },
              { label: '💬 Speak',   type: 'speak',    color: '#58E87A', bg: 'rgba(88,232,122,.18)'  },
            ].map(b => (
              <button key={b.type} onClick={() => openModal(b.type)} style={{
                background: b.bg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: `1.5px solid ${b.color}`, color: b.color,
                padding: '12px 6px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              }}>{b.label}</button>
            ))}
          </div>

          {/* Secondary actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: '📖 ScapeDex', fn: () => router.push('/scapedex') },
              { label: '🛂 Passport',  fn: () => router.push('/passport') },
              { label: '✈ Planner',   fn: () => router.push('/planner') },
            ].map(b => (
              <button key={b.label} onClick={b.fn} style={{
                background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,.18)', color: 'rgba(255,255,255,.75)',
                padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              }}>{b.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* PRICES MODAL */}
      {activeModal === 'prices' && (
        <Modal title="✈ Price Estimate" onClose={() => setActiveModal(null)}>
          <p style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 20, lineHeight: 1.6 }}>
            Estimated costs to <b style={{ color: 'var(--amber)' }}>{dest.name}</b> from your location
          </p>
          <label style={lbl}>Your Country</label>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input style={inp} placeholder="Search country..." value={countrySearch} autoFocus
              onChange={e => { setCountrySearch(e.target.value); setShowCountryDrop(true); if (!e.target.value) setSelectedCountry(null) }}
              onFocus={() => setShowCountryDrop(true)} />
            {showCountryDrop && countrySearch.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1A1630', border: '1px solid rgba(240,235,224,.12)', borderRadius: 10, zIndex: 50, maxHeight: 200, overflowY: 'auto', marginTop: 4 }}>
                {COUNTRIES.filter(c =>
                  c.name.toLowerCase().includes(countrySearch.toLowerCase().replace(/[^a-z]/gi, '')) ||
                  c.currency.toLowerCase().includes(countrySearch.toLowerCase())
                ).slice(0, 8).map(c => (
                  <button key={c.name} onClick={() => { setSelectedCountry(c); setCountrySearch(c.flag + ' ' + c.name); setShowCountryDrop(false) }}
                    style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 20 }}>{c.flag}</span>
                    <div>
                      <p style={{ fontSize: 14, color: 'var(--sand)', fontWeight: 600, margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--mist)', margin: 0 }}>{c.currency} · {c.symbol}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <label style={lbl}>Your City (optional)</label>
          <input style={{ ...inp, marginBottom: 16 }}
            placeholder={selectedCountry ? 'e.g. Mumbai, Chennai...' : 'Select country first'}
            value={originInput} onChange={e => setOriginInput(e.target.value)} disabled={!selectedCountry} />
          <label style={lbl}>Trip Duration</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {[3,5,7,10,14,21].map(d => (
              <button key={d} onClick={() => setTripDays(d)} style={{
                padding: '8px 16px', borderRadius: 100, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                border: `2px solid ${tripDays===d ? 'var(--amber)' : 'rgba(240,235,224,.1)'}`,
                background: tripDays===d ? 'rgba(232,146,74,.15)' : 'var(--ink2)',
                color: tripDays===d ? 'var(--amber)' : 'var(--mist)',
                fontSize: 13, fontWeight: tripDays===d ? 700 : 400,
              }}>{d}N</button>
            ))}
          </div>
          <button onClick={loadPrices} disabled={!selectedCountry || priceLoading} style={{
            width: '100%', padding: '15px 0', marginBottom: 20, fontSize: 15, fontWeight: 700,
            background: selectedCountry ? 'var(--amber)' : 'rgba(232,146,74,.3)',
            color: 'var(--ink)', border: 'none', borderRadius: 12,
            cursor: selectedCountry ? 'pointer' : 'default', fontFamily: "'DM Sans',sans-serif",
            boxShadow: selectedCountry ? '0 4px 20px rgba(232,146,74,.3)' : 'none',
          }}>
            {priceLoading ? 'Calculating…' : 'Calculate Trip Cost →'}
          </button>
          {priceLoading && <Loader />}
          {priceData && <PriceDisplay data={priceData} days={tripDays} country={selectedCountry} />}
        </Modal>
      )}

      {activeModal === 'cuisine' && (
        <Modal title={`🍽 ${dest.name} Cuisine`} onClose={() => setActiveModal(null)}>
          {cuisineLoading && <Loader />}
          {cuisine && <CuisineDisplay data={cuisine} />}
        </Modal>
      )}

      {activeModal === 'speak' && (
        <Modal title="💬 Speak Like a Local" onClose={() => setActiveModal(null)}>
          {phraseLoading && <Loader />}
          {phrasebook && <PhraseDisplay data={phrasebook} />}
        </Modal>
      )}
    </>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0A0812', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'max(52px,calc(var(--st)+28px)) 22px 16px', borderBottom: '1px solid rgba(232,146,74,.15)', flexShrink: 0 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--sand)', margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: 'var(--mist)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px max(24px,calc(var(--sb)+16px))', WebkitOverflowScrolling: 'touch', maxWidth: 600, width: '100%', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}

function Loader() {
  return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
}

function ErrBox({ msg }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <p style={{ fontSize: 36, marginBottom: 12 }}>⚠️</p>
      <p style={{ color: '#FF6B6B', fontSize: 14, lineHeight: 1.6 }}>{String(msg || 'Error')}</p>
    </div>
  )
}

function PriceDisplay({ data, days, country }) {
  if (!data) return null
  if (data.error) return <ErrBox msg={data.error} />
  if (data.parseError || !data.flights) return <ErrBox msg="Could not load prices. Please try again." />

  function parseNums(str) {
    const s = String(str || '')
    const found = s.match(/[0-9]+/g)
    if (!found) return [0, 0]
    const nums = found.map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n > 10)
    return nums.length >= 2 ? [nums[0], nums[1]] : nums.length === 1 ? [nums[0], nums[0]] : [0, 0]
  }

  function cvt(usd) {
    if (!usd || !country || country.currency === 'USD') return usd
    return Math.round(usd * country.rate)
  }

  function fmt(usd) {
    if (!usd || usd === 0) return '—'
    const amt = cvt(usd)
    const s = (country && country.symbol) ? String(country.symbol) : '$'
    if (amt >= 10000000) return s + (amt / 10000000).toFixed(1) + 'Cr'
    if (amt >= 100000)   return s + (amt / 100000).toFixed(1) + 'L'
    if (amt >= 1000)     return s + (amt / 1000).toFixed(0) + 'K'
    return s + amt.toLocaleString()
  }

  function fmtRange(val) {
    // Defend against [object Object] — flatten nested objects to string
    if (!val) return '—'
    let str = typeof val === 'object' ? (val.economy || val.mid || val.range || Object.values(val)[0] || '') : val
    str = String(str || '—')
    if (str === '[object Object]' || str === 'undefined') return '—'
    if (!country || country.currency === 'USD') return str
    const [lo, hi] = parseNums(str)
    if (!lo) return str
    return lo === hi ? fmt(lo) : fmt(lo) + ' – ' + fmt(hi)
  }

  const d = days || 7
  const [flLo, flHi]   = parseNums(data.flights?.economy)
  const [htMlo, htMhi] = parseNums(data.hotel?.mid)
  const [htLlo, htLhi] = parseNums(data.hotel?.luxury)
  const [dyMlo, dyMhi] = parseNums(data.dailyCost?.mid)

  const totMidLo = flLo + (htMlo + dyMlo) * d
  const totMidHi = flHi + (htMhi + dyMhi) * d
  const totLuxLo = flLo + (htLlo + dyMhi * 1.5) * d
  const totLuxHi = flHi + (htLhi + dyMhi * 2) * d
  const hasTotals = totMidLo > 100
  const cur = country && country.currency !== 'USD' ? country.currency : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {hasTotals && (
        <div style={{ background: 'linear-gradient(135deg,rgba(232,146,74,.2),rgba(232,146,74,.06))', border: '2px solid rgba(232,146,74,.4)', borderRadius: 16, padding: '18px 18px' }}>
          <p style={eb}>🧳 TOTAL TRIP — {d} NIGHTS{cur ? ` · ${cur}` : ''}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Explorer',  lo: totMidLo, hi: totMidHi, c: '#E8924A', sub: 'Comfortable & smart' },
              { label: 'Indulge',   lo: totLuxLo, hi: totLuxHi, c: '#5BC8FF', sub: 'Premium experience' },
            ].map(({ label, lo, hi, c, sub }) => (
              <div key={label} style={{ textAlign: 'center', background: 'rgba(0,0,0,.25)', borderRadius: 10, padding: '12px 8px' }}>
                <p style={{ fontSize: 9, color: c, marginBottom: 3, letterSpacing: 1.5, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>{label}</p>
                <p style={{ fontSize: 9, color: 'var(--mist)', marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{sub}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: c, lineHeight: 1.1, margin: 0 }}>{fmt(lo)}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', margin: '2px 0 0' }}>to {fmt(hi)}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, color: 'rgba(232,146,74,.5)', marginTop: 10, textAlign: 'center', margin: '10px 0 0' }}>
            Flights + hotel + daily · {d} nights
          </p>
        </div>
      )}

      {data.nearestAirport && (
        <div style={{ background: 'rgba(91,200,255,.08)', border: '1px solid rgba(91,200,255,.25)', borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ ...eb, color: '#5BC8FF' }}>✈ NEAREST AIRPORT</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--sand)', fontFamily: "'Cormorant Garamond',serif", margin: '4px 0 2px' }}>{data.nearestAirport}</p>
          {data.nearestCity && <p style={{ fontSize: 12, color: 'var(--mist)', margin: '0 0 4px' }}>in {data.nearestCity}</p>}
          {data.distanceFromAirport && <p style={{ fontSize: 13, color: 'rgba(240,232,214,.8)', margin: 0 }}>🚗 {data.distanceFromAirport}</p>}
        </div>
      )}

      {data.flights && (
        <div style={{ background: 'var(--ink2)', borderRadius: 14, padding: '14px 16px' }}>
          <p style={eb}>✈️ FLIGHTS (ONE WAY)</p>
          {data.flights.directAvailable === false && (
            <div style={{ background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>🔄</span>
              <p style={{ fontSize: 12, color: '#FF8A8A', lineHeight: 1.5, margin: 0 }}>
                No direct flights available. Price includes connection via {data.flights.connectionCity || 'a hub city'}.
                {data.flights.connectionTime ? ` Add ~${data.flights.connectionTime} for layover.` : ''}
              </p>
            </div>
          )}
          <PRow label="Explorer class" val={fmtRange(data.flights.economy)} hi />
          {data.flights.business && <PRow label="Premium cabin" val={fmtRange(data.flights.business)} />}
          {data.flights.notes && <p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 8, marginBottom: 0 }}>💡 {data.flights.notes}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { label: '🔍 Google Flights', url: `https://www.google.com/travel/flights/search?q=flights+to+${encodeURIComponent(data.nearestAirport||'destination')}` },
              { label: '🌐 Skyscanner', url: `https://www.skyscanner.net/transport/flights/anywhere/${encodeURIComponent(data.nearestAirport||'')}` },
            ].map(({ label, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--amber)', background: 'rgba(232,146,74,.1)', border: '1px solid rgba(232,146,74,.25)', padding: '5px 12px', borderRadius: 100, textDecoration: 'none', fontFamily: "'DM Sans',sans-serif" }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {data.hotel && (
          <div style={{ background: 'var(--ink2)', borderRadius: 14, padding: '14px 14px' }}>
            <p style={eb}>🏨 HOTEL/NIGHT</p>
            <PRow label="Explorer" val={fmtRange(data.hotel.mid)}    sm hi />
            <PRow label="Indulge" val={fmtRange(data.hotel.luxury)} sm />
          </div>
        )}
        {data.dailyCost && (
          <div style={{ background: 'var(--ink2)', borderRadius: 14, padding: '14px 14px' }}>
            <p style={eb}>💰 DAILY TOTAL</p>
            <PRow label="Explorer" val={fmtRange(data.dailyCost.mid)}    sm hi />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.bestTime && <Chip emoji="🗓" text={'Best time: ' + String(data.bestTime)} />}
        {data.currency && <Chip emoji="💱" text={typeof data.currency === 'object' ? JSON.stringify(data.currency) : String(data.currency)} />}
        {Array.isArray(data.tips) && data.tips.map((t, i) => <Chip key={i} emoji="💡" text={String(t)} />)}
      </div>
      <p style={{ fontSize: 10, color: 'rgba(154,136,120,.4)', textAlign: 'center', margin: 0 }}>AI estimates — verify on Google Flights</p>
    </div>
  )
}

function PRow({ label, val, hi, sm }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: sm ? 5 : 6, gap: 8 }}>
      <span style={{ fontSize: sm ? 11 : 13, color: 'var(--mist)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: sm ? 12 : 14, fontWeight: 700, color: hi ? 'var(--amber)' : 'var(--sand)', textAlign: 'right', fontFamily: "'DM Sans',sans-serif" }}>{val}</span>
    </div>
  )
}

function Chip({ emoji, text }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: '8px 12px' }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{emoji}</span>
      <p style={{ fontSize: 12, color: 'rgba(240,232,214,.65)', lineHeight: 1.5, margin: 0 }}>{text}</p>
    </div>
  )
}

// ── BCP-47 language codes for Web Speech API ───────────────────────────────
const LANG_CODES = {
  japanese:'ja-JP',thai:'th-TH',indonesian:'id-ID',italian:'it-IT',
  french:'fr-FR',spanish:'es-ES',portuguese:'pt-PT',greek:'el-GR',
  vietnamese:'vi-VN',moroccan:'ar-MA',croatian:'hr-HR',turkish:'tr-TR',
  hindi:'hi-IN',nepali:'ne-NP',mandarin:'zh-CN',german:'de-DE',
  slovenian:'sl-SI',norwegian:'nb-NO',icelandic:'is-IS',danish:'da-DK',
  dutch:'nl-NL',polish:'pl-PL',czech:'cs-CZ',georgian:'ka-GE',
  malay:'ms-MY',russian:'ru-RU',swahili:'sw-KE',latinspanish:'es-MX',
  brazilianportuguese:'pt-BR',english:'en-US',finnish:'fi-FI',
  swedish:'sv-SE',hungarian:'hu-HU',romanian:'ro-RO',burmese:'my-MM',
  mongolian:'mn-MN',tibetan:'bo-CN',amharic:'am-ET',kinyarwanda:'rw-RW',
  uzbek:'uz-UZ',turkmen:'tk-TM',arabic:'ar-OM',cantonese:'zh-HK',
  irish:'ga-IE',maltese:'mt-MT',singlish:'en-SG',lao:'lo-LA',seychellois:'fr-SC',
}

function speakText(text, langCode) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new window.SpeechSynthesisUtterance(text)
  utt.lang = langCode || 'en-US'
  utt.rate = 0.85
  utt.pitch = 1.0
  const voices = window.speechSynthesis.getVoices()
  const exact = voices.find(v => v.lang === langCode)
  const partial = voices.find(v => v.lang.startsWith((langCode || 'en').slice(0, 2)))
  if (exact) utt.voice = exact
  else if (partial) utt.voice = partial
  window.speechSynthesis.speak(utt)
}

function PhraseCard({ p, langCode }) {
  const [open, setOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [speakingGuide, setSpeakingGuide] = useState(false)

  function handleSpeakNative(e) {
    e.stopPropagation()
    setSpeaking(true)
    speakText(p.local, langCode)
    setTimeout(() => setSpeaking(false), 2500)
  }

  function handleSpeakGuide(e) {
    e.stopPropagation()
    setSpeakingGuide(true)
    speakText(p.pronunciation, 'en-US') // phonetic is always read in English
    setTimeout(() => setSpeakingGuide(false), 2500)
  }

  return (
    <div style={{ background:'var(--ink2)', borderRadius:12, border: open ? '1px solid rgba(232,146,74,.35)' : '1px solid rgba(240,235,224,.06)', overflow:'hidden', transition:'border-color .2s' }}>

      {/* Header row — always visible */}
      <div onClick={() => setOpen(o => !o)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', cursor:'pointer' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'var(--amber)', marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>
            {p.emoji} {p.category}
          </p>
          <p style={{ fontSize:15, color:'var(--sand)', fontWeight:600, margin:0 }}>{String(p.english||'')}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          {/* Quick-speak button — visible even when collapsed */}
          <button onClick={handleSpeakNative} title="Hear in native language" style={{
            background: speaking ? 'rgba(88,232,122,.2)' : 'rgba(255,255,255,.06)',
            border:`1px solid ${speaking ? '#58E87A' : 'rgba(255,255,255,.12)'}`,
            borderRadius:8, width:32, height:32,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', fontSize:14, transition:'all .2s',
            color: speaking ? '#58E87A' : 'rgba(255,255,255,.55)',
          }}>
            {speaking ? '🔊' : '▶'}
          </button>
          <span style={{ color: open ? 'var(--amber)' : 'var(--mist)', fontSize:18, transition:'color .2s' }}>
            {open ? '−' : '+'}
          </span>
        </div>
      </div>

      {/* Expanded panel */}
      {open && (
        <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', padding:'14px 16px 16px', background:'rgba(232,146,74,.03)' }}>

          {/* Native script card */}
          <div style={{ background:'rgba(0,0,0,.22)', borderRadius:12, padding:'16px', marginBottom:12, textAlign:'center' }}>
            <p style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'rgba(232,146,74,.55)', marginBottom:8, fontFamily:"'DM Sans',sans-serif" }}>
              SHOW THIS TO LOCALS
            </p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:'var(--amber)', lineHeight:1.4, margin:'0 0 14px' }}>
              {String(p.local||'')}
            </p>
            {/* Speak native button */}
            <button onClick={handleSpeakNative} style={{
              background: speaking ? 'rgba(88,232,122,.2)' : 'rgba(232,146,74,.15)',
              border:`1.5px solid ${speaking ? '#58E87A' : 'rgba(232,146,74,.4)'}`,
              borderRadius:100, padding:'9px 22px',
              color: speaking ? '#58E87A' : 'var(--amber)',
              fontSize:13, fontWeight:600, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", transition:'all .2s',
              display:'inline-flex', alignItems:'center', gap:8,
            }}>
              {speaking ? '🔊 Playing…' : '▶ Hear it spoken'}
            </button>
          </div>

          {/* Pronunciation guide */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'rgba(88,232,122,.6)', marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>
                SAY IT LIKE THIS
              </p>
              <p style={{ fontSize:16, color:'#58E87A', fontWeight:600, margin:0, fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 }}>
                {String(p.pronunciation||'')}
              </p>
            </div>
            {/* Speak phonetic button */}
            <button onClick={handleSpeakGuide} title="Hear phonetic guide" style={{
              background: speakingGuide ? 'rgba(88,232,122,.15)' : 'rgba(88,232,122,.06)',
              border:`1px solid ${speakingGuide ? '#58E87A' : 'rgba(88,232,122,.2)'}`,
              borderRadius:8, minWidth:36, height:36, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', fontSize:12, fontWeight:700,
              color: speakingGuide ? '#58E87A' : 'rgba(88,232,122,.6)',
              transition:'all .2s', fontFamily:"'DM Sans',sans-serif",
            }}>
              Aa
            </button>
          </div>

          <p style={{ fontSize:10, color:'rgba(154,136,120,.35)', marginTop:10, margin:'10px 0 0', lineHeight:1.5 }}>
            ▶ native pronunciation · Aa phonetic guide (English speaker voice)
          </p>
        </div>
      )}
    </div>
  )
}

function CuisineDisplay({ data }) {
  if (data.error) return <ErrBox msg={data.error} />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>{data.emoji || '🍽'}</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: 'var(--amber)', marginBottom: 8 }}>{String(data.dish || '')}</h3>
        <p style={{ fontSize: 15, color: 'rgba(240,232,214,.65)', fontStyle: 'italic', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>{String(data.description || '')}</p>
      </div>
      {Array.isArray(data.ingredients) && data.ingredients.length > 0 && (
        <div style={{ background: 'var(--ink2)', borderRadius: 12, padding: 16 }}>
          <p style={sl}>Ingredients</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {data.ingredients.map((i, idx) => (
              <span key={idx} style={{ background: 'var(--ink3)', borderRadius: 100, padding: '5px 14px', fontSize: 12, color: 'rgba(240,232,214,.75)' }}>{String(i)}</span>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(data.steps) && data.steps.length > 0 && (
        <div style={{ background: 'var(--ink2)', borderRadius: 12, padding: 16 }}>
          <p style={sl}>How to Make It</p>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(232,146,74,.2)', border: '1px solid rgba(232,146,74,.4)', color: 'var(--amber)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: 14, color: 'rgba(240,232,214,.8)', lineHeight: 1.6, flex: 1, margin: 0 }}>{String(step)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(data.alsoTry) && data.alsoTry.length > 0 && (
        <div style={{ background: 'var(--ink2)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={sl}>Also Try</p>
          <p style={{ fontSize: 14, color: 'var(--sand)', marginTop: 6, marginBottom: 0 }}>{data.alsoTry.map(String).join(' · ')}</p>
        </div>
      )}
      {data.dietaryNotes && <p style={{ fontSize: 12, color: 'var(--mist)', fontStyle: 'italic', margin: 0 }}>🥗 {String(data.dietaryNotes)}</p>}
    </div>
  )
}

function PhraseDisplay({ data }) {
  if (data.error) return <ErrBox msg={data.error} />

  // Derive BCP-47 code from language key returned by API
  const langCode = data.langCode || LANG_CODES[data.langKey] || 'en-US'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.language && (
        <div style={{ background: 'linear-gradient(135deg,rgba(232,146,74,.12),rgba(232,146,74,.04))', border: '1px solid rgba(232,146,74,.3)', borderRadius: 14, padding: '14px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{data.flag || '🗣️'}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, color: 'var(--amber)', fontWeight: 700, margin: 0, fontFamily: "'Cormorant Garamond',serif" }}>{String(data.language)}</p>
            {data.script && <p style={{ fontSize: 11, color: 'var(--mist)', margin: '2px 0 0' }}>{data.script}</p>}
          </div>
          {/* Test TTS for this language */}
          <button onClick={() => speak('Hello', langCode)} style={{ background: 'rgba(232,146,74,.15)', border: '1px solid rgba(232,146,74,.3)', borderRadius: 8, padding: '6px 12px', color: 'var(--amber)', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            🔊 Test voice
          </button>
        </div>
      )}
      <p style={{ fontSize: 11, color: 'var(--mist)', marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>
        ▶ on each card speaks the native phrase · Aa speaks the phonetic guide
      </p>
      {Array.isArray(data.phrases) && data.phrases.map((p, i) => (
        <PhraseCard key={i} p={p} langCode={langCode} />
      ))}
      {Array.isArray(data.culturalTips) && data.culturalTips.length > 0 && (
        <div style={{ background: 'var(--ink2)', borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
          <p style={sl}>Cultural Tips</p>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.culturalTips.map((t, i) => (
              <p key={i} style={{ fontSize: 13, color: 'rgba(240,232,214,.75)', lineHeight: 1.5, display: 'flex', gap: 8, margin: 0 }}>
                <span>•</span><span>{String(t)}</span>
              </p>
            ))}
          </div>
        </div>
      )}
      {data.emergencyNumbers && typeof data.emergencyNumbers === 'object' && (
        <div style={{ background: 'rgba(255,80,80,.06)', border: '1px solid rgba(255,80,80,.2)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ ...sl, color: '#FF6B6B' }}>Emergency Numbers</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            {Object.entries(data.emergencyNumbers).map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: 9, color: 'rgba(255,100,100,.7)', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{k}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#FF6B6B', margin: 0 }}>{String(v)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const lbl = { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mist)', display: 'block', marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }
const inp = { width: '100%', background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.14)', borderRadius: 8, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--sand)', outline: 'none', boxSizing: 'border-box', display: 'block' }
const eb  = { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', fontFamily: "'DM Sans',sans-serif", margin: '0 0 8px 0' }
const sl  = { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', fontFamily: "'DM Sans',sans-serif" }
