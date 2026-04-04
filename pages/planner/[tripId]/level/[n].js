// pages/planner/[tripId]/level/[n].js
// Full game engine — all 7 mechanics, teaching feedback on every answer
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { LEVEL_META } from '../../../api/planner'

// ── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: ['#E8924A','#58E87A','#5BC8FF','#FF85C0','#FFD060','#B0D8FF'][i % 6],
    delay: Math.random() * 0.4, dur: 0.7 + Math.random() * 0.5,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 300, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{ position: 'absolute', top: -10, left: p.x + '%', width: 8, height: 8, borderRadius: 2, background: p.color, animation: `fall ${p.dur}s ${p.delay}s ease-in forwards` }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(105vh) rotate(720deg); opacity:0 } }`}</style>
    </div>
  )
}

// ── FEEDBACK BANNER ───────────────────────────────────────────────────────────
function FeedbackBanner({ correct, feedbackText, onNext }) {
  if (correct === null) return null
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: correct ? '#0D2A14' : '#2A0D0D', borderTop: `3px solid ${correct ? '#58E87A' : '#FF6B6B'}`, padding: '16px 20px max(24px,calc(var(--sb)+16px))' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: correct ? '#58E87A' : '#FF6B6B', marginBottom: 4 }}>
            {correct ? '✓ Correct!' : '✗ Not quite'}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(240,232,214,.85)', lineHeight: 1.6 }}>{feedbackText}</p>
        </div>
        <button onClick={onNext} style={{ background: correct ? '#58E87A' : '#FF6B6B', color: '#0A0812', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0, marginTop: 2 }}>
          Next →
        </button>
      </div>
    </div>
  )
}

// ── SWIPE MECHANIC ────────────────────────────────────────────────────────────
function SwipeGame({ q, onAnswer }) {
  const [chosen, setChosen] = useState(null)
  function choose(dir) {
    if (chosen) return
    setChosen(dir)
    onAnswer(dir === q.correct_answer, q.feedback_text)
  }
  return (
    <div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--sand)', lineHeight: 1.6, marginBottom: 32, fontStyle: 'italic' }}>
        "{q.prompt}"
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button onClick={() => choose('left')} disabled={!!chosen} style={{
          padding: '20px 12px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: chosen ? 'default' : 'pointer',
          background: chosen === 'left' ? (q.correct_answer === 'left' ? 'rgba(88,232,122,.2)' : 'rgba(255,107,107,.15)') : 'rgba(255,107,107,.08)',
          border: `2px solid ${chosen === 'left' ? (q.correct_answer === 'left' ? '#58E87A' : '#FF6B6B') : 'rgba(255,107,107,.3)'}`,
          color: chosen === 'left' ? (q.correct_answer === 'left' ? '#58E87A' : '#FF6B6B') : '#FF8A8A',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 32 }}>👎</span>
          <span>Bad idea</span>
          {chosen === 'left' && q.correct_answer === 'right' && <span style={{ fontSize: 11 }}>✗ Wrong</span>}
          {chosen === 'left' && q.correct_answer === 'left' && <span style={{ fontSize: 11 }}>✓ Right</span>}
        </button>
        <button onClick={() => choose('right')} disabled={!!chosen} style={{
          padding: '20px 12px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: chosen ? 'default' : 'pointer',
          background: chosen === 'right' ? (q.correct_answer === 'right' ? 'rgba(88,232,122,.2)' : 'rgba(255,107,107,.15)') : 'rgba(88,232,122,.08)',
          border: `2px solid ${chosen === 'right' ? (q.correct_answer === 'right' ? '#58E87A' : '#FF6B6B') : 'rgba(88,232,122,.3)'}`,
          color: chosen === 'right' ? (q.correct_answer === 'right' ? '#58E87A' : '#FF6B6B') : '#58E87A',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 32 }}>👍</span>
          <span>Good idea</span>
          {chosen === 'right' && q.correct_answer === 'left' && <span style={{ fontSize: 11 }}>✗ Wrong</span>}
          {chosen === 'right' && q.correct_answer === 'right' && <span style={{ fontSize: 11 }}>✓ Right</span>}
        </button>
      </div>
      {/* Show correct answer highlighted when wrong */}
      {chosen && chosen !== q.correct_answer && (
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#58E87A' }}>
          ✓ The correct answer was: {q.correct_answer === 'right' ? 'Good idea 👍' : 'Bad idea 👎'}
        </p>
      )}
    </div>
  )
}

// ── SCENARIO (MULTIPLE CHOICE) ────────────────────────────────────────────────
function ScenarioGame({ q, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const options = Array.isArray(q.options) ? q.options :
    q.correct_answer && q.wrong_options ? [q.correct_answer, ...q.wrong_options] :
    typeof q.correct_answer === 'string' ? [q.correct_answer, 'Option B', 'Option C'] : []

  function choose(opt) {
    if (selected) return
    setSelected(opt)
    onAnswer(opt === q.correct_answer, q.feedback_text)
  }

  const colors = ['#5BC8FF', '#58E87A', '#FF85C0']
  return (
    <div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--sand)', lineHeight: 1.5, marginBottom: 28 }}>{q.prompt}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt, i) => {
          const isCorrect = opt === q.correct_answer
          let bg = 'var(--ink2)', border = 'rgba(240,235,224,.1)', color = 'var(--sand)'
          if (selected) {
            if (isCorrect) { bg = 'rgba(88,232,122,.15)'; border = '#58E87A'; color = '#58E87A' }
            else if (opt === selected) { bg = 'rgba(255,107,107,.12)'; border = '#FF6B6B'; color = '#FF6B6B' }
          }
          return (
            <button key={i} onClick={() => choose(opt)} disabled={!!selected} style={{
              background: bg, border: `2px solid ${border}`, borderRadius: 14,
              padding: '15px 18px', color, fontSize: 14, fontWeight: 500,
              cursor: selected ? 'default' : 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s',
            }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: selected ? 'transparent' : `${colors[i % 3]}22`, border: `1.5px solid ${selected ? border : colors[i % 3]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: selected ? color : colors[i % 3], flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── SPEED TRUE/FALSE ──────────────────────────────────────────────────────────
function SpeedTFGame({ q, onAnswer }) {
  const [answered, setAnswered] = useState(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  function handleAnswer(val) {
    if (answered !== null) return
    clearInterval(timerRef.current)
    setAnswered(val)
    const correct_bool = q.correct_answer === 'true' || q.correct_answer === true
    const isCorrect = val === correct_bool
    onAnswer(val === null ? false : isCorrect, q.feedback_text)
  }

  const urgent = timeLeft <= 3
  const correct_bool = q.correct_answer === 'true' || q.correct_answer === true

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${urgent ? '#FF6B6B' : 'var(--amber)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: urgent ? '#FF6B6B' : 'var(--amber)', transition: 'all .3s' }}>
          {timeLeft}
        </div>
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,5vw,24px)', color: 'var(--sand)', lineHeight: 1.6, marginBottom: 36, textAlign: 'center', fontWeight: 600 }}>
        {q.prompt}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[{ label: '✓ True', val: true }, { label: '✗ False', val: false }].map(btn => {
          let bg = btn.val ? 'rgba(88,232,122,.08)' : 'rgba(255,107,107,.08)'
          let border = btn.val ? 'rgba(88,232,122,.3)' : 'rgba(255,107,107,.3)'
          let color = btn.val ? '#58E87A' : '#FF6B6B'
          if (answered !== null) {
            if (btn.val === correct_bool) { bg = btn.val ? 'rgba(88,232,122,.2)' : 'rgba(255,107,107,.15)'; border = color }
            else if (btn.val === answered) { bg = 'rgba(255,107,107,.1)'; border = '#FF6B6B'; color = '#FF6B6B' }
          }
          return (
            <button key={String(btn.val)} onClick={() => handleAnswer(btn.val)} disabled={answered !== null} style={{ background: bg, border: `2px solid ${border}`, borderRadius: 16, padding: '24px 0', fontSize: 20, fontWeight: 700, color, cursor: answered !== null ? 'default' : 'pointer', transition: 'all .2s' }}>
              {btn.label}
            </button>
          )
        })}
      </div>
      {answered === null && timeLeft === 0 && (
        <p style={{ textAlign: 'center', marginTop: 12, color: '#FF6B6B', fontSize: 13 }}>⏱ Time's up! The answer was: {correct_bool ? 'True' : 'False'}</p>
      )}
    </div>
  )
}

// ── MATCHING ──────────────────────────────────────────────────────────────────
function MatchingGame({ q, onAnswer }) {
  const pairs = q.correct_answer && typeof q.correct_answer === 'object'
    ? Object.entries(q.correct_answer) : []
  const [selected, setSelected] = useState(null) // { side: 'left'|'right', key }
  const [matched, setMatched] = useState([])
  const [wrongFlash, setWrongFlash] = useState(null)
  const [rightOrder] = useState(() => [...pairs].sort(() => Math.random() - 0.5))

  function tap(side, key) {
    if (matched.some(m => m[0] === key || m[1] === key)) return
    if (!selected) { setSelected({ side, key }); return }
    if (selected.side === side) { setSelected({ side, key }); return }
    const leftKey = side === 'left' ? key : selected.key
    const rightKey = side === 'right' ? key : selected.key
    if (pairs.some(([l, r]) => l === leftKey && r === rightKey)) {
      const newMatched = [...matched, [leftKey, rightKey]]
      setMatched(newMatched)
      setSelected(null)
      if (newMatched.length === pairs.length) {
        setTimeout(() => onAnswer(true, q.feedback_text), 600)
      }
    } else {
      setWrongFlash({ left: leftKey, right: rightKey })
      setTimeout(() => { setWrongFlash(null); setSelected(null) }, 700)
      onAnswer(false, q.feedback_text, true) // true = partial wrong, don't end
    }
  }

  const isMatched = key => matched.some(m => m[0] === key || m[1] === key)
  const isSelected = (side, key) => selected?.side === side && selected?.key === key
  const isWrong = (side, key) => wrongFlash && (side === 'left' ? wrongFlash.left === key : wrongFlash.right === key)

  function cellStyle(matched, selected, wrong) {
    return {
      background: matched ? 'rgba(88,232,122,.15)' : wrong ? 'rgba(255,107,107,.15)' : selected ? 'rgba(232,146,74,.2)' : 'var(--ink2)',
      border: `2px solid ${matched ? '#58E87A' : wrong ? '#FF6B6B' : selected ? 'var(--amber)' : 'rgba(240,235,224,.08)'}`,
      borderRadius: 12, padding: '12px 10px', cursor: matched ? 'default' : 'pointer',
      fontSize: 13, color: matched ? '#58E87A' : 'var(--sand)', lineHeight: 1.4,
      transition: 'all .2s', textAlign: 'center', minHeight: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }
  }

  return (
    <div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--sand)', marginBottom: 8 }}>{q.prompt}</p>
      <p style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 18 }}>Match each item on the left to the right</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {pairs.map(([left, right], i) => (
          <>
            <div key={`l${i}`} onClick={() => tap('left', left)} style={cellStyle(isMatched(left), isSelected('left', left), isWrong('left', left))}>{left}</div>
            <div key={`r${i}`} onClick={() => tap('right', rightOrder[i][1])} style={cellStyle(isMatched(rightOrder[i][1]), isSelected('right', rightOrder[i][1]), isWrong('right', rightOrder[i][1]))}>{rightOrder[i][1]}</div>
          </>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--mist)' }}>{matched.length}/{pairs.length} matched</p>
    </div>
  )
}

// ── SEQUENCE ──────────────────────────────────────────────────────────────────
function SequenceGame({ q, onAnswer }) {
  const items = Array.isArray(q.correct_answer) ? q.correct_answer : []
  const [order, setOrder] = useState(() => [...items].sort(() => Math.random() - 0.5))
  const [submitted, setSubmitted] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)

  function moveUp(i) {
    if (i === 0) return
    const arr = [...order]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; setOrder(arr)
  }
  function moveDown(i) {
    if (i === order.length - 1) return
    const arr = [...order]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; setOrder(arr)
  }

  function submit() {
    setSubmitted(true)
    const correct = order.every((item, i) => item === items[i])
    onAnswer(correct, q.feedback_text + (correct ? '' : ` Correct order: ${items.join(' → ')}`))
  }

  return (
    <div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--sand)', marginBottom: 8 }}>{q.prompt}</p>
      <p style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 18 }}>Put these in the correct order — use ↑↓ to reorder</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {order.map((item, i) => (
          <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--ink2)', border: '1px solid rgba(240,235,224,.08)', borderRadius: 12, padding: '12px 14px' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(232,146,74,.2)', color: 'var(--amber)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 14, color: 'var(--sand)' }}>{item}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => moveUp(i)} disabled={i === 0} style={{ background: 'none', border: 'none', color: i === 0 ? 'rgba(255,255,255,.15)' : 'var(--amber)', fontSize: 14, cursor: i === 0 ? 'default' : 'pointer', padding: '0 4px', lineHeight: 1 }}>↑</button>
              <button onClick={() => moveDown(i)} disabled={i === order.length - 1} style={{ background: 'none', border: 'none', color: i === order.length - 1 ? 'rgba(255,255,255,.15)' : 'var(--amber)', fontSize: 14, cursor: i === order.length - 1 ? 'default' : 'pointer', padding: '0 4px', lineHeight: 1 }}>↓</button>
            </div>
          </div>
        ))}
      </div>
      {!submitted && (
        <button onClick={submit} className="btn-primary" style={{ width: '100%', padding: '14px 0' }}>
          Submit Order →
        </button>
      )}
    </div>
  )
}

// ── SLIDER ────────────────────────────────────────────────────────────────────
function SliderGame({ q, onAnswer }) {
  const [submitted, setSubmitted] = useState(false)
  // Parse target value from correct_answer
  const raw = String(q.correct_answer || '50')
  const numMatch = raw.match(/[\d.]+/)
  const target = numMatch ? parseFloat(numMatch[0]) : 50
  const isTime = raw.includes(':') || raw.includes('AM') || raw.includes('PM')
  const isCurrency = raw.includes('€') || raw.includes('$') || raw.includes('USD')

  // Set slider range based on context
  let min = 0, max = 100, step = 1, unit = ''
  if (isTime) { min = 0; max = 23; step = 0.5; unit = 'h' }
  else if (isCurrency) { min = 0; max = target * 3 || 50; step = 0.1; unit = raw.match(/[€$£]/)?.[0] || '' }
  else if (raw.includes('%')) { min = 0; max = 100; step = 5; unit = '%' }
  else { min = Math.max(0, target * 0.2); max = target * 2.5 || 100; step = target > 100 ? 10 : 1 }

  const [value, setValue] = useState((min + max) / 2)

  function submit() {
    setSubmitted(true)
    const tolerance = (max - min) * 0.15
    const correct = Math.abs(value - target) <= tolerance
    onAnswer(correct, q.feedback_text + ` The answer is ${q.correct_answer}.`)
  }

  const formatVal = (v) => {
    if (isTime) {
      const h = Math.floor(v); const m = (v % 1) * 60
      const period = h < 12 ? 'AM' : 'PM'
      return `${h % 12 || 12}:${m === 0 ? '00' : '30'} ${period}`
    }
    return unit + v.toFixed(unit === '%' ? 0 : 1)
  }

  return (
    <div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--sand)', lineHeight: 1.5, marginBottom: 32 }}>{q.prompt}</p>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--amber)', fontFamily: "'Cormorant Garamond',serif" }}>{formatVal(value)}</p>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => setValue(parseFloat(e.target.value))}
        disabled={submitted}
        style={{ width: '100%', marginBottom: 24, accentColor: 'var(--amber)' }} />
      {!submitted && (
        <button onClick={submit} className="btn-primary" style={{ width: '100%', padding: '14px 0' }}>
          Lock In My Answer →
        </button>
      )}
      {submitted && (
        <div style={{ background: 'var(--ink2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <p style={{ color: 'var(--mist)', fontSize: 13 }}>Correct answer: <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{q.correct_answer}</span></p>
        </div>
      )}
    </div>
  )
}

// ── VISUAL TAP ────────────────────────────────────────────────────────────────
function VisualTapGame({ q, onAnswer }) {
  // Generates tap options from context
  const correct = String(q.correct_answer || '')
  const [options] = useState(() => {
    const wrongOptions = q.wrong_options || q.options ||
      ['The wrong option', 'Another wrong option', 'Also incorrect']
    const allOpts = [correct, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5)
    return allOpts
  })
  const [selected, setSelected] = useState(null)

  function tap(opt) {
    if (selected) return
    setSelected(opt)
    onAnswer(opt === correct, q.feedback_text)
  }

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>👆 TAP THE CORRECT ANSWER</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--sand)', lineHeight: 1.5, marginBottom: 24 }}>{q.prompt}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map((opt, i) => {
          const isCorrect = opt === correct
          let bg = 'var(--ink2)', border = 'rgba(240,235,224,.1)', color = 'var(--sand)'
          if (selected) {
            if (isCorrect) { bg = 'rgba(88,232,122,.15)'; border = '#58E87A'; color = '#58E87A' }
            else if (opt === selected) { bg = 'rgba(255,107,107,.12)'; border = '#FF6B6B'; color = '#FF6B6B' }
          }
          return (
            <button key={i} onClick={() => tap(opt)} disabled={!!selected} style={{ background: bg, border: `2px solid ${border}`, borderRadius: 14, padding: '18px 12px', color, fontSize: 14, fontWeight: 500, cursor: selected ? 'default' : 'pointer', textAlign: 'center', transition: 'all .2s', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN LEVEL PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function LevelGame() {
  const router = useRouter()
  const { tripId, n } = router.query
  const levelNum = parseInt(n)

  const [trip, setTrip] = useState(null)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [feedbackState, setFeedbackState] = useState(null) // { correct, text }
  const [completed, setCompleted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [isPerfect, setIsPerfect] = useState(false)
  const [wrongThisQ, setWrongThisQ] = useState(false) // track if current Q already counted

  const meta = LEVEL_META[levelNum - 1]

  useEffect(() => {
    if (!tripId || !n) return
    const trips = JSON.parse(localStorage.getItem('ss_trips') || '[]')
    const t = trips.find(x => x.id === tripId)
    if (!t) { router.push('/planner'); return }
    setTrip(t)

    const course = JSON.parse(localStorage.getItem('ss_course_' + tripId) || 'null')
    const level = course?.levels?.find(l => l.level_number === levelNum)
    if (!level?.questions?.length) { router.push('/planner/' + tripId); return }
    setQuestions(level.questions)
  }, [tripId, n])

  function handleAnswer(correct, feedbackText, partial = false) {
    if (feedbackState) return // already showing feedback

    if (!correct && !wrongThisQ) {
      setWrongThisQ(true)
      const newLives = lives - 1
      setLives(newLives)
      if (newLives <= 0) {
        setFeedbackState({ correct: false, text: feedbackText })
        setTimeout(() => setGameOver(true), 1500)
        return
      }
    }

    if (correct) {
      setScore(s => s + 1)
      setWrongThisQ(false)
    }

    if (!partial) {
      setFeedbackState({ correct, text: feedbackText })
    } else {
      // Matching partial wrong — just show briefly
      setFeedbackState({ correct: false, text: feedbackText })
      setTimeout(() => setFeedbackState(null), 1000)
    }
  }

  function nextQuestion() {
    setFeedbackState(null)
    setWrongThisQ(false)
    if (qIdx + 1 >= questions.length) {
      finishLevel()
    } else {
      setQIdx(i => i + 1)
    }
  }

  function finishLevel() {
    const perfect = score + 1 === questions.length && lives === 3
    const xp = Math.round(((score + 1) / questions.length) * (meta?.xp || 100) + (perfect ? 50 : 0))
    setXpEarned(xp)
    setIsPerfect(perfect)
    setCompleted(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)

    // Save completion
    const course = JSON.parse(localStorage.getItem('ss_course_' + tripId) || 'null')
    if (course) {
      const lvl = course.levels.find(l => l.level_number === levelNum)
      if (lvl) { lvl.complete = true; lvl.xpEarned = xp; lvl.bestScore = score + 1 }
      localStorage.setItem('ss_course_' + tripId, JSON.stringify(course))
    }
    // Update global XP + streak
    const totalXP = parseInt(localStorage.getItem('ss_xp') || '0') + xp
    localStorage.setItem('ss_xp', totalXP.toString())
    const today = new Date().toDateString()
    if (localStorage.getItem('ss_streak_day') !== today) {
      const prev = localStorage.getItem('ss_streak_day')
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = prev === yesterday ? parseInt(localStorage.getItem('ss_streak') || '0') + 1 : 1
      localStorage.setItem('ss_streak', streak.toString())
      localStorage.setItem('ss_streak_day', today)
    }
  }

  if (!meta || !questions.length) return <div style={{ background: 'var(--ink)', minHeight: '100vh' }} />

  const q = questions[qIdx]
  const mechanic = q?.mechanic

  // ── COMPLETION ──
  if (completed) return (
    <>
      <Confetti active={showConfetti} />
      <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, padding: 32, textAlign: 'center' }}>
        <span style={{ fontSize: 72, marginBottom: 16 }}>{isPerfect ? '🏆' : '✅'}</span>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, color: 'var(--sand)', marginBottom: 8 }}>
          {isPerfect ? 'Perfect Level!' : 'Level Complete!'}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--mist)', marginBottom: 32 }}>
          {score + 1}/{questions.length} correct · {lives} ❤️ remaining
        </p>
        <div style={{ background: 'linear-gradient(135deg,rgba(232,146,74,.2),rgba(232,146,74,.05))', border: '2px solid rgba(232,146,74,.4)', borderRadius: 20, padding: '24px 44px', marginBottom: 32 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: 'var(--amber)', marginBottom: 8 }}>XP EARNED</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>+{xpEarned}</p>
          {isPerfect && <p style={{ fontSize: 12, color: 'var(--amber)', marginTop: 6 }}>+50 perfect bonus ⭐</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
          {levelNum < 9 && (
            <button className="btn-primary" style={{ padding: '16px 0' }}
              onClick={() => router.push(`/planner/${tripId}/level/${levelNum + 1}`)}>
              Next Level: {LEVEL_META[levelNum]?.theme} →
            </button>
          )}
          <button className="btn-back" style={{ alignSelf: 'center' }} onClick={() => router.push('/planner/' + tripId)}>
            ← Back to Course Map
          </button>
        </div>
      </div>
    </>
  )

  // ── GAME OVER ──
  if (gameOver) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
      <span style={{ fontSize: 64 }}>💔</span>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: 'var(--sand)' }}>Out of lives</h2>
      <p style={{ fontSize: 14, color: 'var(--mist)', maxWidth: 280, lineHeight: 1.6 }}>You'll remember more next time. The teaching stays.</p>
      <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={() => { setQIdx(0); setLives(3); setScore(0); setGameOver(false); setFeedbackState(null) }}>
        Try Again
      </button>
      <button className="btn-back" onClick={() => router.push('/planner/' + tripId)}>← Back</button>
    </div>
  )

  const pct = Math.round(qIdx / questions.length * 100)

  return (
    <>
      <Head><title>Level {levelNum}: {meta.theme} — {trip?.dest}</title></Head>
      <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: 'max(16px,calc(var(--st)+10px)) 18px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(240,235,224,.05)', flexShrink: 0 }}>
          <button className="btn-back" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => router.push('/planner/' + tripId)}>✕</button>
          {/* Progress bar */}
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--amber)', borderRadius: 100, width: pct + '%', transition: 'width .4s ease' }} />
          </div>
          {/* Lives */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[1,2,3].map(i => <span key={i} style={{ fontSize: 16, filter: i <= lives ? 'none' : 'grayscale(1)', opacity: i <= lives ? 1 : 0.3 }}>❤️</span>)}
          </div>
        </div>

        {/* Level title */}
        <div style={{ padding: '14px 20px 6px', flexShrink: 0 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', fontFamily: "'DM Sans',sans-serif", marginBottom: 3 }}>
            {meta.emoji} Level {levelNum} · {meta.theme}
          </p>
          <p style={{ fontSize: 11, color: 'var(--mist)' }}>Question {qIdx + 1} of {questions.length}</p>
        </div>

        {/* Mechanic badge */}
        <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>
          <span style={{ fontSize: 10, background: 'rgba(255,255,255,.06)', color: 'var(--mist)', padding: '3px 10px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif", letterSpacing: 1 }}>
            {mechanic === 'swipe' ? '👍👎 SWIPE' : mechanic === 'speed_tf' ? '⚡ TRUE / FALSE' : mechanic === 'matching' ? '🧩 MATCH' : mechanic === 'sequence' ? '🔢 SEQUENCE' : mechanic === 'slider' ? '🎚 SLIDER' : mechanic === 'visual_tap' ? '👆 TAP' : '🎯 SCENARIO'}
          </span>
        </div>

        {/* Game content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 140px', WebkitOverflowScrolling: 'touch', maxWidth: 540, width: '100%', margin: '0 auto' }}>
          {mechanic === 'swipe'      && <SwipeGame    q={q} onAnswer={handleAnswer} key={qIdx} />}
          {mechanic === 'scenario'   && <ScenarioGame q={q} onAnswer={handleAnswer} key={qIdx} />}
          {mechanic === 'speed_tf'   && <SpeedTFGame  q={q} onAnswer={handleAnswer} key={qIdx} />}
          {mechanic === 'matching'   && <MatchingGame q={q} onAnswer={handleAnswer} key={qIdx} />}
          {mechanic === 'sequence'   && <SequenceGame q={q} onAnswer={handleAnswer} key={qIdx} />}
          {mechanic === 'slider'     && <SliderGame   q={q} onAnswer={handleAnswer} key={qIdx} />}
          {mechanic === 'visual_tap' && <VisualTapGame q={q} onAnswer={handleAnswer} key={qIdx} />}
          {/* Fallback for unknown mechanics */}
          {!['swipe','scenario','speed_tf','matching','sequence','slider','visual_tap'].includes(mechanic) && (
            <ScenarioGame q={q} onAnswer={handleAnswer} key={qIdx} />
          )}
        </div>

        {/* Feedback banner */}
        {feedbackState && (
          <FeedbackBanner correct={feedbackState.correct} feedbackText={feedbackState.text} onNext={nextQuestion} />
        )}
      </div>
    </>
  )
}
