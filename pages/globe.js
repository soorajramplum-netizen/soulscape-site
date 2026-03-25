// pages/globe.js
// Globe explorer - redirects to client-side globe component
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { DESTINATIONS, CATS, slugify } from '../data/destinations'

const LANDS=[
[[-168,72],[-140,70],[-120,72],[-100,73],[-88,71],[-82,63],[-63,47],[-67,44],[-70,42],[-76,34],[-80,25],[-88,16],[-92,16],[-85,10],[-78,8],[-83,8],[-90,20],[-97,22],[-106,24],[-110,29],[-117,32],[-120,34],[-124,46],[-130,55],[-145,60],[-153,58],[-166,60],[-168,64],[-168,72]],
[[-45,85],[-25,83],[-18,77],[-20,70],[-24,65],[-37,63],[-46,62],[-57,63],[-60,67],[-55,71],[-52,76],[-45,80],[-45,85]],
[[-75,12],[-62,11],[-50,0],[-34,-6],[-35,-11],[-39,-16],[-38,-23],[-45,-30],[-53,-33],[-58,-36],[-63,-38],[-66,-42],[-68,-47],[-75,-52],[-68,-55],[-65,-55],[-66,-46],[-70,-43],[-70,-35],[-68,-29],[-70,-20],[-75,-14],[-78,-8],[-80,0],[-77,5],[-75,12]],
[[-9,37],[-9,43],[-4,44],[3,43],[7,44],[12,44],[14,40],[16,37],[13,38],[10,44],[14,47],[17,48],[20,49],[23,55],[24,58],[20,60],[15,58],[9,58],[5,58],[8,64],[14,65],[18,70],[28,71],[30,68],[28,60],[28,57],[23,55],[18,55],[10,55],[8,55],[2,51],[-5,48],[-5,43],[-9,39],[-9,37]],
[[5,57],[8,58],[14,58],[18,58],[24,65],[28,71],[30,70],[27,65],[24,60],[18,57],[14,56],[10,55],[5,57]],
[[-17,15],[-15,11],[-15,5],[-8,5],[-2,5],[9,4],[10,2],[9,-1],[13,-5],[12,-17],[12,-25],[17,-29],[19,-35],[25,-34],[32,-30],[36,-25],[40,-11],[42,-13],[44,-11],[45,-1],[43,12],[43,16],[38,22],[37,28],[32,31],[25,32],[13,32],[10,37],[5,37],[-2,35],[-8,35],[-13,30],[-17,20],[-17,15]],
[[44,-12],[48,-15],[50,-20],[48,-25],[44,-25],[43,-20],[44,-12]],
[[32,30],[44,29],[50,24],[56,22],[56,14],[43,12],[43,16],[38,22],[36,22],[38,20],[44,20],[50,18],[54,18],[56,20],[56,24],[52,26],[50,24],[46,24],[44,28],[38,29],[32,30]],
[[26,70],[30,68],[35,65],[42,68],[52,70],[62,74],[76,73],[100,70],[120,68],[135,60],[140,50],[143,46],[135,40],[130,35],[126,34],[122,30],[114,25],[104,22],[100,20],[100,10],[103,1],[105,-6],[110,-8],[115,-8],[120,0],[125,2],[120,10],[115,15],[110,18],[104,18],[98,22],[94,26],[88,28],[80,25],[72,22],[68,25],[60,25],[56,22],[50,24],[44,28],[38,29],[36,36],[36,40],[38,44],[44,43],[46,42],[52,45],[58,50],[62,52],[68,55],[76,58],[86,58],[92,60],[96,60],[102,65],[112,70],[122,68],[130,68]],
[[66,23],[68,24],[72,22],[80,8],[80,12],[78,10],[76,8],[80,8],[84,8],[80,8],[77,8],[80,9],[88,22],[92,24],[92,27],[88,28],[80,28],[72,24],[66,23]],
[[131,31],[132,33],[133,34],[135,35],[138,37],[140,40],[142,44],[143,44],[141,40],[139,38],[137,37],[135,34],[133,34],[131,31]],
[[114,-22],[118,-21],[124,-17],[130,-12],[136,-12],[140,-17],[142,-18],[148,-20],[150,-22],[153,-28],[152,-33],[151,-35],[149,-38],[146,-38],[140,-36],[134,-36],[130,-32],[126,-34],[114,-34],[113,-29],[114,-22]],
[[172,-41],[175,-40],[178,-38],[175,-37],[172,-38],[172,-41]],
[[166,-46],[170,-46],[172,-44],[171,-43],[168,-44],[166,-46]],
]

const COUNTRY_LABELS=[
  {name:'USA',lat:38,lng:-97},{name:'Canada',lat:56,lng:-96},
  {name:'Brazil',lat:-10,lng:-53},{name:'UK',lat:54,lng:-2},
  {name:'France',lat:46,lng:2},{name:'Germany',lat:51,lng:10},
  {name:'Russia',lat:61,lng:105},{name:'China',lat:35,lng:104},
  {name:'India',lat:20,lng:78},{name:'Japan',lat:36,lng:138},
  {name:'Australia',lat:-25,lng:133},{name:'S.Africa',lat:-29,lng:25},
  {name:'Morocco',lat:32,lng:-6},{name:'Norway',lat:64,lng:14},
  {name:'Turkey',lat:39,lng:35},{name:'Iceland',lat:65,lng:-18},
  {name:'NZ',lat:-41,lng:174},{name:'Peru',lat:-10,lng:-76},
  {name:'Indonesia',lat:-5,lng:120},{name:'Thailand',lat:15,lng:101},
]

const CAT_COL = Object.fromEntries(Object.entries(CATS).map(([k,v])=>[k,v.color]))
const VIBES = [
  {id:'serene',name:'Serene',emoji:'🕊️',vec:[3,1,1,4,1,4]},
  {id:'wild',name:'Wild',emoji:'⚡',vec:[5,2,1,4,5,2]},
  {id:'ancient',name:'Ancient',emoji:'🗿',vec:[4,1,1,5,1,3]},
  {id:'romantic',name:'Romantic',emoji:'🌹',vec:[2,3,2,2,2,5]},
  {id:'culture',name:'Culture',emoji:'🏛️',vec:[2,5,5,3,4,5]},
  {id:'healing',name:'Healing',emoji:'🌿',vec:[2,2,1,4,1,4]},
  {id:'epic',name:'Epic',emoji:'🏔️',vec:[5,2,1,5,4,2]},
]

export default function Globe() {
  const router = useRouter()
  const cvs = useRef(null)
  const raf = useRef(null)
  const state = useRef({ lat:15,lon:25,drag:false,lx:0,ly:0,auto:true,autoTm:null,hov:null,stars:[] })
  const [hover, setHover] = useState(null)
  const [catFilter, setCatFilter] = useState(null)
  const [vibeFilter, setVibeFilter] = useState(null)
  const [drawer, setDrawer] = useState(null)
  const [count, setCount] = useState(DESTINATIONS.length)

  const CAT_PROFILES = {waters:[3,2,1,4,2,4],forest:[2,3,1,4,2,2],mountain:[4,2,1,4,3,2],desert:[4,1,1,5,1,4],garden:[2,3,2,2,2,4],waterfall:[3,2,1,3,5,3],city:[2,4,5,2,4,4],arctic:[4,1,1,5,3,1]}
  const W = [1.2,1.0,1.5,0.8,1.3,1.0]

  function getFiltered() {
    let pool = catFilter ? DESTINATIONS.filter(d=>d.cat===catFilter) : DESTINATIONS
    if (vibeFilter) {
      const vec = vibeFilter.vec
      pool = pool.filter(d => {
        const p = CAT_PROFILES[d.cat]
        let dist=0; for(let i=0;i<6;i++) dist+=W[i]*Math.pow(p[i]-vec[i],2)
        return Math.sqrt(dist)<3.5
      })
    }
    return pool
  }

  function proj(lat,lon,W,H) {
    const s = state.current
    const la=lat*Math.PI/180,lo=lon*Math.PI/180
    const cla=s.lat*Math.PI/180,clo=s.lon*Math.PI/180
    const R=Math.min(W,H)*0.38
    const x=R*(Math.cos(la)*Math.sin(lo-clo))
    const y=R*(Math.sin(la)*Math.cos(cla)-Math.cos(la)*Math.cos(lo-clo)*Math.sin(cla))
    const z=Math.sin(la)*Math.sin(cla)+Math.cos(la)*Math.cos(lo-clo)*Math.cos(cla)
    return {x:W/2+x, y:H/2-y, z}
  }

  function doHov(mx,my) {
    const c = cvs.current; if(!c) return
    const W=c.width,H=c.height
    const pool = getFiltered()
    let best=null,bd=999
    for(const d of pool) {
      const p=proj(d.lat,d.lng,W,H)
      if(p.z<0.05) continue
      const dx=p.x-mx,dy=p.y-my,dist=Math.sqrt(dx*dx+dy*dy)
      if(dist<32&&dist<bd){bd=dist;best=d}
    }
    state.current.hov=best
    setHover(best)
    if(c) c.style.cursor=best?'pointer':state.current.drag?'grabbing':'grab'
  }

  function draw() {
    const c=cvs.current; if(!c) return
    const s=state.current
    if(s.auto&&!s.drag) s.lon+=0.08
    const W=c.width,H=c.height
    const ctx=c.getContext('2d')
    ctx.clearRect(0,0,W,H)
    const bg=ctx.createRadialGradient(W*.6,H*.4,0,W/2,H/2,Math.max(W,H)*.8)
    bg.addColorStop(0,'#0D1B3E');bg.addColorStop(.5,'#07101F');bg.addColorStop(1,'#030810')
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H)
    if(!s.stars.length) s.stars=Array.from({length:250},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+0.2,a:Math.random()*.7+.1}))
    s.stars.forEach(st=>{ctx.beginPath();ctx.arc(st.x*W,st.y*H,st.r,0,Math.PI*2);ctx.fillStyle=`rgba(200,220,255,${st.a})`;ctx.fill()})
    const R=Math.min(W,H)*0.38
    const cx=W/2,cy=H/2
    const og=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.08,cx,cy,R)
    og.addColorStop(0,'#2A5298');og.addColorStop(.35,'#1A3A6E');og.addColorStop(.7,'#0E2040');og.addColorStop(1,'#050F20')
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=og;ctx.fill()
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip()
    const lg=ctx.createLinearGradient(cx-R,cy-R,cx+R,cy+R)
    lg.addColorStop(0,'#3D6B32');lg.addColorStop(.5,'#2E5526');lg.addColorStop(1,'#1E3A18')
    LANDS.forEach(poly=>{
      ctx.fillStyle=lg;ctx.beginPath();let st=false
      for(const [lo,la] of poly){const p=proj(la,lo,W,H);if(p.z>0){if(!st){ctx.moveTo(p.x,p.y);st=true}else ctx.lineTo(p.x,p.y)}else if(st){ctx.closePath();ctx.fill();ctx.beginPath();st=false}}
      if(st){ctx.closePath();ctx.fill()}
      ctx.strokeStyle='rgba(100,160,80,.25)';ctx.lineWidth=.6;ctx.beginPath();st=false
      for(const [lo,la] of poly){const p=proj(la,lo,W,H);if(p.z>.05){if(!st){ctx.moveTo(p.x,p.y);st=true}else ctx.lineTo(p.x,p.y)}else if(st){ctx.stroke();ctx.beginPath();st=false}}
      if(st)ctx.stroke()
    })
    ctx.strokeStyle='rgba(100,160,255,.06)';ctx.lineWidth=.5
    for(const lat of[-60,-30,0,30,60]){ctx.beginPath();let f=true;for(let lo=-180;lo<=180;lo+=3){const p=proj(lat,lo,W,H);if(p.z>0){if(f){ctx.moveTo(p.x,p.y);f=false}else ctx.lineTo(p.x,p.y)}else f=true}ctx.stroke()}
    COUNTRY_LABELS.forEach(cl=>{
      const p=proj(cl.lat,cl.lng,W,H);if(p.z<.25)return
      const alpha=Math.min(1,(p.z-.25)*2)*.65
      ctx.fillStyle=`rgba(200,220,255,${alpha.toFixed(2)})`;ctx.font=`500 ${R>120?9:7}px DM Sans,sans-serif`;ctx.textAlign='center'
      ctx.fillText(cl.name,p.x,p.y)
    })
    ctx.restore()
    const atm=ctx.createRadialGradient(cx,cy,R*.92,cx,cy,R*1.2)
    atm.addColorStop(0,'rgba(60,130,255,.28)');atm.addColorStop(.6,'rgba(60,130,255,.06)');atm.addColorStop(1,'rgba(60,130,255,0)')
    ctx.beginPath();ctx.arc(cx,cy,R*1.2,0,Math.PI*2);ctx.fillStyle=atm;ctx.fill()
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='rgba(80,140,255,.25)';ctx.lineWidth=1.5;ctx.stroke()
    const shown=getFiltered()
    shown.map(d=>({d,p:proj(d.lat,d.lng,W,H)})).filter(x=>x.p.z>.05).sort((a,b)=>a.p.z-b.p.z)
    .forEach(({d,p})=>{
      const isH=s.hov===d,col=CAT_COL[d.cat],sz=isH?10:4.5
      if(isH){const gl=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,24);gl.addColorStop(0,col+'55');gl.addColorStop(1,col+'00');ctx.beginPath();ctx.arc(p.x,p.y,24,0,Math.PI*2);ctx.fillStyle=gl;ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y,14,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(240,235,215,.95)';ctx.font=`600 ${R>120?12:10}px DM Sans,sans-serif`;ctx.textAlign='center';ctx.fillText(d.name,p.x,p.y-18)}
      const a=.5+p.z*.5;ctx.beginPath();ctx.arc(p.x,p.y,sz,0,Math.PI*2);ctx.fillStyle=isH?col:col+Math.floor(a*200).toString(16).padStart(2,'0');ctx.fill()
    })
    raf.current=requestAnimationFrame(draw)
  }

  useEffect(()=>{
    const c=cvs.current;if(!c)return
    const resize=()=>{c.width=window.innerWidth;c.height=window.innerHeight}
    resize();window.addEventListener('resize',resize)
    const s=state.current
    c.addEventListener('mousedown',e=>{s.drag=true;s.lx=e.clientX;s.ly=e.clientY;s.auto=false;clearTimeout(s.autoTm);document.getElementById('gtip').style.opacity='0'})
    window.addEventListener('mousemove',e=>{if(s.drag){s.lon+=(e.clientX-s.lx)*.4;s.lat=Math.max(-80,Math.min(80,s.lat-(e.clientY-s.ly)*.4));s.lx=e.clientX;s.ly=e.clientY};doHov(e.clientX,e.clientY)})
    window.addEventListener('mouseup',()=>{s.drag=false;s.autoTm=setTimeout(()=>s.auto=true,4000)})
    c.addEventListener('click',e=>{doHov(e.clientX,e.clientY);if(s.hov)router.push('/place/'+slugify(s.hov.name))})
    let pt0=null
    c.addEventListener('touchstart',e=>{s.drag=true;s.lx=e.touches[0].clientX;s.ly=e.touches[0].clientY;s.auto=false;clearTimeout(s.autoTm);pt0={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};document.getElementById('gtip').style.opacity='0'},{passive:true})
    c.addEventListener('touchmove',e=>{if(s.drag&&e.touches.length===1){s.lon+=(e.touches[0].clientX-s.lx)*.4;s.lat=Math.max(-80,Math.min(80,s.lat-(e.touches[0].clientY-s.ly)*.4));s.lx=e.touches[0].clientX;s.ly=e.touches[0].clientY}},{passive:true})
    c.addEventListener('touchend',e=>{s.drag=false;s.autoTm=setTimeout(()=>s.auto=true,4000);if(pt0){const dx=e.changedTouches[0].clientX-pt0.x,dy=e.changedTouches[0].clientY-pt0.y;if(Math.sqrt(dx*dx+dy*dy)<16){doHov(e.changedTouches[0].clientX,e.changedTouches[0].clientY);if(s.hov)router.push('/place/'+slugify(s.hov.name))}}})
    draw()
    return ()=>{cancelAnimationFrame(raf.current);window.removeEventListener('resize',resize)}
  },[catFilter,vibeFilter])

  useEffect(()=>{setCount(getFiltered().length)},[catFilter,vibeFilter])

  return (<>
    <Head><title>Globe — SoulScape</title></Head>
    <div style={{position:'fixed',inset:0,background:'#030810',overflow:'hidden'}}>
      <canvas ref={cvs} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />
      <div style={{position:'absolute',top:'max(14px,calc(var(--st)+8px))',left:0,right:0,zIndex:20,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 16px'}}>
        <button className="btn-back" onClick={()=>router.push('/')}>← Back</button>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:16,color:'rgba(240,232,214,.85)',textShadow:'0 2px 8px rgba(0,0,0,.8)'}}>🌍 SoulScape</span>
        <span style={{fontSize:10,color:'rgba(240,232,214,.4)',background:'rgba(0,0,0,.4)',padding:'4px 10px',borderRadius:100,border:'1px solid rgba(255,255,255,.08)'}}>{count}</span>
      </div>
      <div id="gtip" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:5,textAlign:'center',pointerEvents:'none',transition:'opacity .8s'}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:'italic',color:'rgba(240,232,214,.3)',marginBottom:4,textShadow:'0 2px 8px rgba(0,0,0,.8)'}}>Drag to explore the world</p>
        <span style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'rgba(240,232,214,.15)'}}>Tap any dot to visit</span>
      </div>
      {hover && (
        <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-120%)',zIndex:25,background:'rgba(8,12,24,.96)',border:'1px solid rgba(232,146,74,.35)',borderRadius:14,padding:'12px 16px',backdropFilter:'blur(18px)',minWidth:160,maxWidth:220}}>
          <div style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'var(--amber)',marginBottom:4}}>{CATS[hover.cat].name}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:'var(--sand)',lineHeight:1.2,marginBottom:3}}>{hover.name}</div>
          <div style={{fontSize:11,color:'var(--mist)',marginBottom:6}}>{hover.country}</div>
          <div style={{fontSize:9,color:'var(--amber)',letterSpacing:1,textTransform:'uppercase'}}>Tap to visit →</div>
        </div>
      )}
      <div style={{position:'absolute',bottom:'max(24px,calc(var(--sb)+18px))',left:'50%',transform:'translateX(-50%)',zIndex:20,display:'flex',gap:10}}>
        <button style={{background:'rgba(10,8,18,.85)',border:'1px solid rgba(255,255,255,.18)',color:'rgba(240,232,214,.8)',padding:'10px 20px',borderRadius:100,fontSize:13,cursor:'pointer',backdropFilter:'blur(12px)',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap',...(drawer==='world'?{background:'rgba(232,146,74,.25)',borderColor:'var(--amber)',color:'var(--amber)'}:{})}} onClick={()=>setDrawer(d=>d==='world'?null:'world')}>🌊 World Type</button>
        <button style={{background:'rgba(10,8,18,.85)',border:'1px solid rgba(255,255,255,.18)',color:'rgba(240,232,214,.8)',padding:'10px 20px',borderRadius:100,fontSize:13,cursor:'pointer',backdropFilter:'blur(12px)',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap',...(drawer==='vibe'?{background:'rgba(232,146,74,.25)',borderColor:'var(--amber)',color:'var(--amber)'}:{})}} onClick={()=>setDrawer(d=>d==='vibe'?null:'vibe')}>✨ Vibe</button>
      </div>
      {drawer && (
        <>
          <div style={{position:'absolute',inset:0,zIndex:28,background:'rgba(0,0,0,.5)'}} onClick={()=>setDrawer(null)} />
          <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:29,background:'linear-gradient(to top,#0A0812,#0F0C1A)',borderTop:'1px solid rgba(232,146,74,.2)',borderRadius:'20px 20px 0 0',padding:'0 0 max(24px,calc(var(--sb)+16px))'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px 12px',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
              <span style={{fontSize:11,fontWeight:600,letterSpacing:3,textTransform:'uppercase',color:'var(--amber)',fontFamily:"'DM Sans',sans-serif"}}>{drawer==='world'?'World Type':'Vibe'}</span>
              <button style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',color:'var(--mist)',width:28,height:28,borderRadius:'50%',cursor:'pointer'}} onClick={()=>setDrawer(null)}>✕</button>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,padding:'14px 16px',maxHeight:'40vh',overflowY:'auto'}}>
              {drawer==='world' ? [
                ['all','🌍','All Worlds'],
                ...Object.entries(CATS).map(([k,c])=>[k,c.emoji,c.name])
              ].map(([key,emoji,name])=>(
                <button key={key} style={{background:catFilter===key||(!catFilter&&key==='all')?'rgba(232,146,74,.2)':'rgba(255,255,255,.05)',border:`1px solid ${catFilter===key||(!catFilter&&key==='all')?'var(--amber)':'rgba(255,255,255,.1)'}`,color:catFilter===key||(!catFilter&&key==='all')?'var(--amber)':'rgba(240,232,214,.6)',padding:'9px 14px',borderRadius:10,fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",display:'flex',alignItems:'center',gap:7,flex:'1',minWidth:120}} onClick={()=>{setCatFilter(key==='all'?null:key);setDrawer(null)}}>
                  <span style={{fontSize:16}}>{emoji}</span><span>{name}</span>
                </button>
              )) : [
                ['all','✨','All Vibes'],
                ...VIBES.map(v=>[v.id,v.emoji,v.name])
              ].map(([key,emoji,name])=>(
                <button key={key} style={{background:vibeFilter?.id===key||(!vibeFilter&&key==='all')?'rgba(232,146,74,.2)':'rgba(255,255,255,.05)',border:`1px solid ${vibeFilter?.id===key||(!vibeFilter&&key==='all')?'var(--amber)':'rgba(255,255,255,.1)'}`,color:vibeFilter?.id===key||(!vibeFilter&&key==='all')?'var(--amber)':'rgba(240,232,214,.6)',padding:'9px 14px',borderRadius:10,fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",display:'flex',alignItems:'center',gap:7,flex:'1',minWidth:120}} onClick={()=>{setVibeFilter(key==='all'?null:VIBES.find(v=>v.id===key));setDrawer(null)}}>
                  <span style={{fontSize:16}}>{emoji}</span><span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </>)
}
