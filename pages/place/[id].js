// pages/place/[id].js — Fixed: no overlay, full-screen modals
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { DESTINATIONS, CATS, getDestinationById, slugify } from '../../data/destinations'

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY || ''

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

  useEffect(() => {
    if (!id) return
    const d = getDestinationById(id)
    if (!d) { router.push('/'); return }
    setDest(d)
    stampVisit(d)
    setOriginInput(localStorage.getItem('ss_city') || '')
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
    const h = d.name.split('').reduce((a,c)=>a+c.charCodeAt(0),0)
    for (const q of [d.q1, d.q2, CATS[d.cat].name+' aerial drone cinematic landscape']) {
      try {
        const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=10&page=${(h%4)+1}&min_duration=5`,{headers:{Authorization:PEXELS_KEY}})
        if (!r.ok) continue
        const data = await r.json()
        const real = (data.videos||[]).filter(v=>v.video_files?.some(f=>f.link?.includes('.mp4')&&f.width>=640))
        if (!real.length) continue
        const v = real[(h%10)%real.length]
        const files = v.video_files.filter(f=>f.link?.includes('.mp4')&&f.width>=640).sort((a,b)=>b.width-a.width)
        const f = files.find(f=>f.width>=1280&&f.width<=1920)||files[0]
        if (f) { setVideoUrl(f.link); break }
      } catch(e) { continue }
    }
  }

  function openModal(type) {
    setActiveModal(type)
    if (type==='cuisine'&&!cuisine) loadCuisine()
    if (type==='speak'&&!phrasebook) loadPhrasebook()
  }

  async function loadPrices() {
    const city = originInput.trim()
    if (!city) { alert('Enter your departure city first, e.g. Chennai, India'); return }
    localStorage.setItem('ss_city', city)
    setPriceLoading(true); setPriceData(null)
    try {
      const res = await fetch('/api/prices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destName:dest.name,destCountry:dest.country,originCity:city})})
      setPriceData(await res.json())
    } catch(e) { setPriceData({error:'Connection error. Please try again.'}) }
    setPriceLoading(false)
  }

  async function loadCuisine() {
    if (cuisine) return
    setCuisineLoading(true)
    try {
      const res = await fetch('/api/cuisine',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destName:dest.name,destCountry:dest.country})})
      setCuisine(await res.json())
    } catch(e) { setCuisine({error:'Could not load cuisine data.'}) }
    setCuisineLoading(false)
  }

  async function loadPhrasebook() {
    if (phrasebook) return
    setPhraseLoading(true)
    try {
      const res = await fetch('/api/phrasebook',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destName:dest.name,destCountry:dest.country})})
      setPhrasebook(await res.json())
    } catch(e) { setPhrasebook({error:'Could not load phrase data.'}) }
    setPhraseLoading(false)
  }

  if (!dest) return <div style={{background:'var(--ink)',minHeight:'100vh'}}/>
  const cat = CATS[dest.cat]

  return (<>
    <Head><title>{dest.name} — SoulScape</title></Head>
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'var(--ink)'}}>

      {/* VIDEO 75% */}
      <div style={{flex:'0 0 75%',position:'relative',overflow:'hidden',background:cat.glow?`radial-gradient(ellipse at center,${cat.glow} 0%,${cat.glow} 60%,#060810 100%)`:'#060810'}}>
        {videoUrl&&<video src={videoUrl} autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
        <div style={{position:'absolute',top:'max(14px,calc(var(--st)+6px))',left:14,right:14,zIndex:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn-back" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>router.push('/')}>🏠 Home</button>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:15,color:'rgba(255,255,255,.85)',textShadow:'0 2px 10px rgba(0,0,0,.6)'}}>SoulScape</span>
          <span style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,.6)',background:'rgba(0,0,0,.3)',backdropFilter:'blur(6px)',padding:'4px 11px',borderRadius:100,border:'1px solid rgba(255,255,255,.1)'}}>{cat.emoji} {cat.name}</span>
        </div>
      </div>

      {/* CONTENT 25% */}
      <div style={{flex:1,background:'var(--ink)',borderTop:'1px solid rgba(232,146,74,.12)',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'10px 16px max(12px,calc(var(--sb)+8px))'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
            <span style={{fontSize:8,letterSpacing:2,textTransform:'uppercase',color:'var(--mist)'}}>{dest.country.toUpperCase()}</span>
            <span style={{fontSize:9,color:'rgba(154,136,120,.35)'}}>·</span>
            <span style={{fontSize:8,letterSpacing:2,textTransform:'uppercase',color:'var(--mist)'}}>{cat.name.toUpperCase()}</span>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(20px,5.5vw,34px)',fontWeight:700,color:'var(--sand)',lineHeight:1,letterSpacing:-.5,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3}}>{dest.name}</h1>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontStyle:'italic',color:'rgba(240,232,214,.45)',lineHeight:1.4,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{dest.desc}</p>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <button style={bS.amber} onClick={()=>openModal('prices')}>✈ Prices</button>
          <button style={bS.amber} onClick={()=>openModal('cuisine')}>🍽 Cuisine</button>
          <button style={bS.amber} onClick={()=>openModal('speak')}>💬 Speak</button>
          <button style={bS.violet} onClick={()=>router.push('/scapedex')}>📖 ScapeDex</button>
          <button style={bS.violet} onClick={()=>router.push('/passport')}>🛂 Passport</button>
        </div>
      </div>
    </div>

    {/* PRICES MODAL */}
    {activeModal==='prices'&&(
      <Modal title="✈ Price Estimate" onClose={()=>setActiveModal(null)}>
        <p style={{fontSize:14,color:'var(--mist)',marginBottom:16}}>Estimated costs from your city to <b style={{color:'var(--amber)'}}>{dest.name}</b></p>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <input style={iS} placeholder="Your city (e.g. Chennai, India)" value={originInput} onChange={e=>setOriginInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadPrices()} autoFocus/>
          <button className="btn-primary" style={{padding:'12px 20px',fontSize:13,flexShrink:0}} onClick={loadPrices}>{priceLoading?'…':'Check'}</button>
        </div>
        {priceLoading&&<Loader/>}
        {priceData&&<PriceDisplay data={priceData}/>}
      </Modal>
    )}

    {/* CUISINE MODAL */}
    {activeModal==='cuisine'&&(
      <Modal title={`🍽 ${dest.name} Cuisine`} onClose={()=>setActiveModal(null)}>
        {cuisineLoading&&<Loader/>}
        {cuisine&&<CuisineDisplay data={cuisine}/>}
      </Modal>
    )}

    {/* SPEAK MODAL */}
    {activeModal==='speak'&&(
      <Modal title="💬 Speak Like a Local" onClose={()=>setActiveModal(null)}>
        {phraseLoading&&<Loader/>}
        {phrasebook&&<PhraseDisplay data={phrasebook}/>}
      </Modal>
    )}
  </>)
}

function Modal({title,onClose,children}){
  return(
    <div style={{position:'fixed',inset:0,zIndex:100,background:'#0A0812',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'max(52px,calc(var(--st)+28px)) 22px 16px',borderBottom:'1px solid rgba(232,146,74,.15)',flexShrink:0}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:'var(--sand)'}}>{title}</h2>
        <button onClick={onClose} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.14)',color:'var(--mist)',width:36,height:36,borderRadius:'50%',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'20px 22px max(24px,calc(var(--sb)+16px))',WebkitOverflowScrolling:'touch',maxWidth:600,width:'100%',margin:'0 auto'}}>
        {children}
      </div>
    </div>
  )
}

function Loader(){return <div style={{display:'flex',justifyContent:'center',padding:40}}><div className="spinner"/></div>}

function PriceDisplay({data}){
  if(data.error) return <p style={{color:'#FF6B6B',fontSize:14}}>{data.error}</p>
  if(data.parseError||!data.flights) return <div style={{marginTop:8}}><p style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'var(--amber)',marginBottom:12}}>Price Information</p><p style={{fontSize:14,color:'rgba(240,232,214,.8)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{data.raw||JSON.stringify(data,null,2)}</p></div>
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {data.flights&&<PCard emoji="✈️" title="Flights" rows={[['Economy',data.flights.economy]]} note={data.flights.notes}/>}
      {data.hotel&&<PCard emoji="🏨" title="Hotel per Night" rows={[['Budget',data.hotel.budget],['Mid-range',data.hotel.mid],['Luxury',data.hotel.luxury]]}/>}
      {data.dailyCost&&<PCard emoji="💰" title="Daily Budget" rows={[['Budget traveller',data.dailyCost.budget],['Mid traveller',data.dailyCost.mid]]}/>}
      {data.bestTime&&<p style={{fontSize:13,color:'rgba(240,232,214,.7)',display:'flex',gap:8}}><span>🗓</span><span>Best time: {data.bestTime}</span></p>}
      {data.currency&&<p style={{fontSize:13,color:'rgba(240,232,214,.7)',display:'flex',gap:8}}><span>💱</span><span>{data.currency}</span></p>}
      {data.tips?.map((t,i)=><p key={i} style={{fontSize:13,color:'rgba(240,232,214,.7)',display:'flex',gap:8}}><span>💡</span><span>{t}</span></p>)}
      <p style={{fontSize:10,color:'rgba(154,136,120,.45)',marginTop:4}}>AI estimates — verify on Google Flights before booking.</p>
    </div>
  )
}

function PCard({emoji,title,rows,note}){
  return(
    <div style={{background:'var(--ink2)',borderRadius:12,padding:'14px 16px'}}>
      <p style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'var(--amber)',marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>{emoji} {title}</p>
      {rows.map(([l,v])=>(
        <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:6,alignItems:'baseline'}}>
          <span style={{fontSize:13,color:'var(--mist)'}}>{l}</span>
          <span style={{fontSize:14,color:'var(--sand)',fontWeight:600}}>{v||'—'}</span>
        </div>
      ))}
      {note&&<p style={{fontSize:12,color:'var(--mist)',marginTop:8,fontStyle:'italic',lineHeight:1.5}}>{note}</p>}
    </div>
  )
}

function CuisineDisplay({data}){
  if(data.error) return <p style={{color:'#FF6B6B'}}>{data.error}</p>
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{textAlign:'center',paddingTop:8}}>
        <div style={{fontSize:64,marginBottom:8}}>{data.emoji}</div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:'var(--amber)',marginBottom:8}}>{data.dish}</h3>
        <p style={{fontSize:15,color:'rgba(240,232,214,.65)',fontStyle:'italic',lineHeight:1.7,maxWidth:400,margin:'0 auto'}}>{data.description}</p>
      </div>
      <div style={{background:'var(--ink2)',borderRadius:12,padding:16}}>
        <p style={sL}>Ingredients</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>{data.ingredients?.map(i=><span key={i} style={{background:'var(--ink3)',borderRadius:100,padding:'5px 14px',fontSize:12,color:'rgba(240,232,214,.75)'}}>{i}</span>)}</div>
      </div>
      <div style={{background:'var(--ink2)',borderRadius:12,padding:16}}>
        <p style={sL}>How to Make It</p>
        <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:10}}>
          {data.steps?.map((step,i)=>(
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(232,146,74,.2)',border:'1px solid rgba(232,146,74,.4)',color:'var(--amber)',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
              <p style={{fontSize:14,color:'rgba(240,232,214,.8)',lineHeight:1.6,flex:1}}>{step}</p>
            </div>
          ))}
        </div>
      </div>
      {data.alsoTry?.length>0&&<div style={{background:'var(--ink2)',borderRadius:12,padding:'14px 16px'}}><p style={sL}>Also Try</p><p style={{fontSize:14,color:'var(--sand)',marginTop:6}}>{data.alsoTry.join(' · ')}</p></div>}
      {data.dietaryNotes&&<p style={{fontSize:12,color:'var(--mist)',fontStyle:'italic'}}>🥗 {data.dietaryNotes}</p>}
    </div>
  )
}

function PhraseDisplay({data}){
  const [flipped,setFlipped]=useState({})
  if(data.error) return <p style={{color:'#FF6B6B'}}>{data.error}</p>
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {data.language&&<div style={{background:'var(--ink2)',borderRadius:12,padding:'12px 16px',marginBottom:4}}><p style={{fontSize:16,color:'var(--amber)',fontWeight:600}}>{data.language}{data.script?` (${data.script})`:''}</p></div>}
      <p style={{...sL,marginBottom:4}}>Tap any phrase to reveal</p>
      {data.phrases?.map((p,i)=>(
        <div key={i} onClick={()=>setFlipped(f=>({...f,[i]:!f[i]}))} style={{background:'var(--ink2)',borderRadius:12,padding:'14px 16px',cursor:'pointer',border:flipped[i]?'1px solid rgba(232,146,74,.4)':'1px solid rgba(240,235,224,.06)',transition:'border-color .2s'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              <p style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--amber)',marginBottom:4}}>{p.emoji} {p.category}</p>
              <p style={{fontSize:16,color:'var(--sand)',fontWeight:600}}>{p.english}</p>
              {flipped[i]&&<div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,.06)'}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'var(--amber)',marginBottom:4}}>{p.local}</p>
                <p style={{fontSize:13,color:'var(--mist)',fontStyle:'italic'}}>Say: {p.pronunciation}</p>
              </div>}
            </div>
            <span style={{color:'var(--mist)',fontSize:20,marginLeft:12}}>{flipped[i]?'−':'+'}</span>
          </div>
        </div>
      ))}
      {data.culturalTips?.length>0&&<div style={{background:'var(--ink2)',borderRadius:12,padding:'14px 16px',marginTop:8}}><p style={sL}>Cultural Tips</p><div style={{marginTop:10,display:'flex',flexDirection:'column',gap:8}}>{data.culturalTips.map((t,i)=><p key={i} style={{fontSize:13,color:'rgba(240,232,214,.75)',lineHeight:1.5,display:'flex',gap:8}}><span>•</span><span>{t}</span></p>)}</div></div>}
      {data.emergencyNumbers&&<div style={{background:'rgba(255,80,80,.06)',border:'1px solid rgba(255,80,80,.2)',borderRadius:12,padding:'14px 16px',marginTop:4}}><p style={{...sL,color:'#FF6B6B'}}>Emergency Numbers</p><div style={{display:'flex',gap:16,marginTop:10,flexWrap:'wrap'}}>{Object.entries(data.emergencyNumbers).map(([k,v])=><div key={k}><p style={{fontSize:10,color:'rgba(255,100,100,.7)',textTransform:'uppercase',letterSpacing:1}}>{k}</p><p style={{fontSize:20,fontWeight:700,color:'#FF6B6B'}}>{v}</p></div>)}</div></div>}
    </div>
  )
}

const sL={fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'var(--amber)',fontFamily:"'DM Sans',sans-serif"}
const iS={flex:1,background:'var(--ink2)',border:'1px solid rgba(240,235,224,.14)',borderRadius:8,padding:'12px 14px',fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--sand)',outline:'none'}
const bS={
  amber:{background:'rgba(232,146,74,.12)',border:'1px solid rgba(232,146,74,.3)',color:'var(--amber2)',padding:'7px 12px',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap'},
  violet:{background:'rgba(123,108,176,.12)',border:'1px solid rgba(123,108,176,.3)',color:'#C0B4E8',padding:'7px 12px',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap'},
}
