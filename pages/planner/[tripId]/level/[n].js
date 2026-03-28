// pages/planner/[tripId]/level/[n].js
// The actual game session — Duolingo-style interactive levels

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { LEVEL_META, PHASES } from '../../../api/planner'

// ── CONFETTI ────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#E8924A','#58E87A','#5BC8FF','#FF85C0','#FFD060','#B0D8FF'][i % 6],
    delay: Math.random() * 0.5,
    dur: 0.8 + Math.random() * 0.6,
  }))
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: -12, left: p.x + '%',
          width: 8, height: 8, borderRadius: 2,
          background: p.color,
          animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  )
}

// ── LIVES DISPLAY ────────────────────────────────────────────────────────────
function Lives({ count, max = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ fontSize: 18, filter: i < count ? 'none' : 'grayscale(1)', opacity: i < count ? 1 : 0.3, transition: 'all .3s' }}>❤️</span>
      ))}
    </div>
  )
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, color = 'var(--amber)' }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,.08)', borderRadius: 100, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', background: color, borderRadius: 100, width: `${(current / total) * 100}%`, transition: 'width .4s ease' }} />
    </div>
  )
}

// ── FEEDBACK OVERLAY ─────────────────────────────────────────────────────────
function FeedbackBanner({ state, text, onNext }) {
  if (!state) return null
  const isCorrect = state === 'correct'
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: isCorrect ? '#1A3A1A' : '#3A1A1A',
      borderTop: `3px solid ${isCorrect ? '#58E87A' : '#FF6B6B'}`,
      padding: '20px 24px max(28px,calc(var(--sb)+20px))',
      animation: 'slideUp .25s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, maxWidth: 560, margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: isCorrect ? '#58E87A' : '#FF6B6B', marginBottom: 4 }}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </p>
          {text && <p style={{ fontSize: 13, color: 'rgba(240,232,214,.8)', lineHeight: 1.6 }}>{text}</p>}
        </div>
        <button onClick={onNext} style={{
          background: isCorrect ? '#58E87A' : '#FF6B6B', color: '#0A0812',
          border: 'none', borderRadius: 12, padding: '12px 22px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
        }}>
          Continue →
        </button>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// GAME COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ── MULTIPLE CHOICE QUIZ ─────────────────────────────────────────────────────
function QuizGame({ data, levelMeta, onComplete, onWrongAnswer }) {
  const questions = data.questions || []
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [score, setScore] = useState(0)

  const q = questions[qIdx]
  if (!q) return null

  function choose(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === q.correct
    setFeedback(correct ? 'correct' : 'wrong')
    setFeedbackText(q.explanation || q.fact || q.revelation || q.wisdom || '')
    if (correct) setScore(s => s + 1)
    else onWrongAnswer()
  }

  function next() {
    setSelected(null); setFeedback(null); setFeedbackText('')
    if (qIdx + 1 >= questions.length) {
      onComplete(score + (selected === q.correct ? 1 : 0), questions.length)
    } else {
      setQIdx(i => i + 1)
    }
  }

  const optColors = ['#5BC8FF', '#58E87A', '#FF85C0', '#FFD060']

  return (
    <>
      {data.mantra && qIdx === 0 && (
        <div style={{ background: 'rgba(232,146,74,.08)', border: '1px solid rgba(232,146,74,.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 9, letterSpacing: 3, color: 'var(--amber)', fontFamily: "'DM Sans',sans-serif" }}>YOUR MANTRA</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: 'italic', color: 'var(--sand)', marginTop: 4 }}>"{data.mantra}"</p>
        </div>
      )}
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,5vw,24px)', color: 'var(--sand)', lineHeight: 1.5, marginBottom: 28, fontWeight: 600 }}>{q.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options?.map((opt, i) => {
          let bg = 'var(--ink2)', border = 'rgba(240,235,224,.1)', color = 'var(--sand)'
          if (selected !== null) {
            if (i === q.correct) { bg = 'rgba(88,232,122,.15)'; border = '#58E87A'; color = '#58E87A' }
            else if (i === selected && selected !== q.correct) { bg = 'rgba(255,107,107,.12)'; border = '#FF6B6B'; color = '#FF6B6B' }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} style={{
              background: bg, border: `2px solid ${border}`, borderRadius: 14,
              padding: '16px 18px', color, fontSize: 15, fontWeight: 500,
              cursor: selected !== null ? 'default' : 'pointer', textAlign: 'left',
              transition: 'all .2s', fontFamily: "'DM Sans',sans-serif",
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: selected === null ? `${optColors[i]}22` : 'transparent', border: `1.5px solid ${selected === null ? optColors[i] : border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: selected === null ? optColors[i] : color, flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      <FeedbackBanner state={feedback} text={feedbackText} onNext={next} />
    </>
  )
}

// ── TRUE / FALSE SPEED ROUND ──────────────────────────────────────────────────
function TrueFalseGame({ data, onComplete, onWrongAnswer }) {
  const statements = data.statements || []
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(8)
  const timerRef = useRef(null)

  const s = statements[idx]

  useEffect(() => {
    if (answered !== null) return
    setTimeLeft(8)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(null) // time's up
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [idx, answered])

  function handleAnswer(ans) {
    clearInterval(timerRef.current)
    if (answered !== null) return
    setAnswered(ans)
    const correct = ans === s.answer
    setFeedback(correct ? 'correct' : 'wrong')
    setFeedbackText(s.explanation)
    if (correct) setScore(sc => sc + 1)
    else onWrongAnswer()
  }

  function next() {
    setAnswered(null); setFeedback(null); setFeedbackText('')
    if (idx + 1 >= statements.length) onComplete(score, statements.length)
    else setIdx(i => i + 1)
  }

  if (!s) return null
  const urgency = timeLeft <= 3

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${urgency ? '#FF6B6B' : 'var(--amber)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: urgency ? '#FF6B6B' : 'var(--amber)', transition: 'color .3s, border-color .3s', animation: urgency ? 'pulse .5s ease-in-out infinite' : 'none' }}>
          {timeLeft}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 36 }}>{s.emoji}</span>
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,5vw,24px)', color: 'var(--sand)', lineHeight: 1.5, marginBottom: 36, textAlign: 'center', fontWeight: 600 }}>
        {s.statement}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[{ label: '✓ True', val: true, color: '#58E87A' }, { label: '✗ False', val: false, color: '#FF6B6B' }].map(btn => {
          let bg = btn.val ? 'rgba(88,232,122,.08)' : 'rgba(255,107,107,.08)'
          let border = btn.val ? 'rgba(88,232,122,.3)' : 'rgba(255,107,107,.3)'
          if (answered !== null) {
            if (btn.val === s.answer) { bg = btn.val ? 'rgba(88,232,122,.2)' : 'rgba(255,107,107,.2)'; border = btn.color }
            else if (btn.val === answered) { bg = 'rgba(255,107,107,.1)'; border = '#FF6B6B' }
          }
          return (
            <button key={String(btn.val)} onClick={() => handleAnswer(btn.val)} disabled={answered !== null} style={{
              background: bg, border: `2px solid ${border}`, borderRadius: 16,
              padding: '24px 0', fontSize: 20, fontWeight: 700, color: btn.color,
              cursor: answered !== null ? 'default' : 'pointer', transition: 'all .2s',
            }}>
              {btn.label}
            </button>
          )
        })}
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }`}</style>
      <FeedbackBanner state={feedback} text={feedbackText} onNext={next} />
    </>
  )
}

// ── MATCH PAIRS ───────────────────────────────────────────────────────────────
function MatchGame({ data, onComplete, onWrongAnswer }) {
  const pairs = data.pairs || []
  const [selected, setSelected] = useState(null) // { side: 'left'|'right', idx }
  const [matched, setMatched] = useState([]) // indices of matched pairs
  const [wrongPair, setWrongPair] = useState(null)
  const [revealFact, setRevealFact] = useState(null)

  // Shuffle right side
  const [rightOrder] = useState(() => pairs.map((_, i) => i).sort(() => Math.random() - 0.5))

  function tap(side, idx) {
    if (matched.includes(idx)) return
    if (wrongPair) return

    if (!selected) {
      setSelected({ side, idx })
      return
    }

    // Get the pair index for each side
    const leftIdx = side === 'left' ? idx : selected.idx
    const rightIdx = side === 'right' ? idx : selected.idx

    if (selected.side === side) { setSelected({ side, idx }); return }

    const rightPairIdx = rightOrder[rightIdx]
    if (leftIdx === rightPairIdx) {
      // Match!
      setMatched(m => [...m, leftIdx])
      setSelected(null)
      setRevealFact(pairs[leftIdx].fact)
      setTimeout(() => setRevealFact(null), 2500)
      if (matched.length + 1 >= pairs.length) {
        setTimeout(() => onComplete(pairs.length, pairs.length), 2800)
      }
    } else {
      // Wrong
      setWrongPair({ left: leftIdx, right: rightIdx })
      onWrongAnswer()
      setTimeout(() => { setWrongPair(null); setSelected(null) }, 900)
    }
  }

  const cellStyle = (isMatched, isSelected, isWrong) => ({
    background: isMatched ? 'rgba(88,232,122,.15)' : isWrong ? 'rgba(255,107,107,.15)' : isSelected ? 'rgba(232,146,74,.2)' : 'var(--ink2)',
    border: `2px solid ${isMatched ? '#58E87A' : isWrong ? '#FF6B6B' : isSelected ? 'var(--amber)' : 'rgba(240,235,224,.08)'}`,
    borderRadius: 12, padding: '12px 10px', cursor: isMatched ? 'default' : 'pointer',
    fontSize: 13, color: isMatched ? '#58E87A' : 'var(--sand)', lineHeight: 1.4,
    transition: 'all .2s', textAlign: 'center', minHeight: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'DM Sans',sans-serif", fontWeight: isMatched ? 600 : 400,
  })

  return (
    <>
      {data.intro && <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: 'italic', color: 'var(--mist)', marginBottom: 20, lineHeight: 1.6 }}>{data.intro}</p>}
      <p style={{ fontSize: 13, color: 'var(--mist)', marginBottom: 16, textAlign: 'center' }}>Match each area to its vibe</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {pairs.map((pair, i) => (
          <>
            <div key={`l${i}`} onClick={() => tap('left', i)} style={cellStyle(matched.includes(i), selected?.side === 'left' && selected.idx === i, wrongPair?.left === i)}>
              {pair.area}
            </div>
            <div key={`r${i}`} onClick={() => tap('right', i)} style={cellStyle(matched.includes(rightOrder[i]), selected?.side === 'right' && selected.idx === i, wrongPair?.right === i)}>
              {pairs[rightOrder[i]].vibe}
            </div>
          </>
        ))}
      </div>
      {revealFact && (
        <div style={{ marginTop: 16, background: 'rgba(88,232,122,.08)', border: '1px solid rgba(88,232,122,.25)', borderRadius: 12, padding: '12px 16px', animation: 'fadeIn .3s ease' }}>
          <p style={{ fontSize: 13, color: '#58E87A', lineHeight: 1.6 }}>✓ {revealFact}</p>
        </div>
      )}
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--mist)' }}>{matched.length} / {pairs.length} matched</p>
    </>
  )
}

// ── FLASHCARD DRILL ───────────────────────────────────────────────────────────
function FlashcardGame({ data, onComplete, onWrongAnswer }) {
  const cards = data.cards || []
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState([]) // 'got' or 'retry'
  const [queue, setQueue] = useState(() => cards.map((_, i) => i))

  const cardIdx = queue[idx]
  const card = cards[cardIdx]

  if (!card) {
    const gotCount = done.filter(d => d === 'got').length
    setTimeout(() => onComplete(gotCount, cards.length), 100)
    return null
  }

  function handleResponse(response) {
    const newDone = [...done, response]
    setDone(newDone)
    if (response === 'retry') onWrongAnswer()
    setFlipped(false)
    // If retry, add card back to end of queue
    if (response === 'retry') {
      setQueue(q => [...q, cardIdx])
    }
    setTimeout(() => setIdx(i => i + 1), 200)
  }

  const remaining = queue.length - idx

  return (
    <>
      {data.language && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--amber)' }}>{data.language}</span>
          {data.script && <span style={{ fontSize: 11, color: 'var(--mist)', background: 'var(--ink2)', padding: '2px 10px', borderRadius: 100 }}>{data.script}</span>}
          {data.emergencyNumbers && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
              {Object.entries(data.emergencyNumbers).map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 8, color: 'rgba(255,100,100,.7)', textTransform: 'uppercase' }}>{k}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#FF6B6B' }}>{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p style={{ fontSize: 11, color: 'var(--mist)', textAlign: 'center', marginBottom: 16 }}>{remaining} cards remaining</p>

      {/* The card */}
      <div onClick={() => !flipped && setFlipped(true)} style={{
        background: flipped ? 'linear-gradient(135deg,rgba(232,146,74,.15),rgba(123,108,176,.1))' : 'var(--ink2)',
        border: `2px solid ${flipped ? 'rgba(232,146,74,.4)' : 'rgba(240,235,224,.08)'}`,
        borderRadius: 20, padding: '32px 24px', textAlign: 'center',
        cursor: flipped ? 'default' : 'pointer', transition: 'all .3s',
        minHeight: 200, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20,
      }}>
        <span style={{ fontSize: 32 }}>{card.emoji}</span>
        {!flipped ? (
          <>
            <p style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)' }}>{card.category}</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, color: 'var(--sand)' }}>{card.front}</p>
            <p style={{ fontSize: 12, color: 'var(--mist)' }}>Tap to reveal</p>
          </>
        ) : (
          <>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: 'var(--amber)' }}>{card.back}</p>
            <p style={{ fontSize: 16, color: 'rgba(240,232,214,.7)', fontStyle: 'italic' }}>say: {card.pronunciation}</p>
            {card.memoryHook && (
              <p style={{ fontSize: 12, color: 'var(--mist)', background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '8px 14px', marginTop: 4 }}>💡 {card.memoryHook}</p>
            )}
          </>
        )}
      </div>

      {flipped && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button onClick={() => handleResponse('retry')} style={{ background: 'rgba(255,107,107,.1)', border: '2px solid rgba(255,107,107,.3)', borderRadius: 14, padding: '16px 0', fontSize: 15, fontWeight: 700, color: '#FF6B6B', cursor: 'pointer' }}>
            ✗ Need practice
          </button>
          <button onClick={() => handleResponse('got')} style={{ background: 'rgba(88,232,122,.12)', border: '2px solid rgba(88,232,122,.35)', borderRadius: 14, padding: '16px 0', fontSize: 15, fontWeight: 700, color: '#58E87A', cursor: 'pointer' }}>
            ✓ Got it!
          </button>
        </div>
      )}
    </>
  )
}

// ── FILL IN THE BLANK ─────────────────────────────────────────────────────────
function FillBlankGame({ data, onComplete, onWrongAnswer }) {
  const questions = data.questions || []
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)

  const q = questions[idx]
  if (!q) return null

  const parts = q.sentence.split('___')

  function choose(optIdx) {
    if (selected !== null) return
    setSelected(optIdx)
    const correct = optIdx === q.correct
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
    else onWrongAnswer()
  }

  function next() {
    setSelected(null); setFeedback(null)
    if (idx + 1 >= questions.length) onComplete(score + (selected === q.correct ? 1 : 0), questions.length)
    else setIdx(i => i + 1)
  }

  if (data.dish && idx === 0) {
    // Recipe intro
  }

  // Shuffle options display order (but track correct)
  const shuffled = useState(() => {
    const opts = q.options.map((o, i) => ({ text: o, originalIdx: i }))
    return opts.sort(() => Math.random() - 0.5)
  })[0]

  return (
    <>
      {data.intro && idx === 0 && <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontStyle: 'italic', color: 'var(--mist)', marginBottom: 20, lineHeight: 1.6 }}>{data.intro}</p>}
      {data.dish && idx === 0 && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 48 }}>{data.emoji}</span>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: 'var(--amber)', marginTop: 6 }}>{data.dish}</p>
          {data.story && <p style={{ fontSize: 13, color: 'var(--mist)', marginTop: 4, fontStyle: 'italic' }}>{data.story}</p>}
        </div>
      )}

      {/* Sentence with blank */}
      <div style={{ background: 'var(--ink2)', borderRadius: 16, padding: '24px 20px', marginBottom: 24, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(17px,4.5vw,22px)', color: 'var(--sand)', lineHeight: 1.7, textAlign: 'center' }}>
          {parts[0]}
          <span style={{
            display: 'inline-block', borderBottom: `2px solid ${selected !== null ? '#58E87A' : 'var(--amber)'}`,
            minWidth: 80, padding: '0 8px', color: selected !== null ? '#58E87A' : 'var(--amber)',
            fontWeight: 700, textAlign: 'center',
          }}>
            {selected !== null ? q.options[q.correct] : '   ___   '}
          </span>
          {parts[1]}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = 'var(--ink2)', border = 'rgba(240,235,224,.1)', color = 'var(--sand)'
          if (selected !== null) {
            if (i === q.correct) { bg = 'rgba(88,232,122,.15)'; border = '#58E87A'; color = '#58E87A' }
            else if (i === selected) { bg = 'rgba(255,107,107,.1)'; border = '#FF6B6B'; color = '#FF6B6B' }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} style={{
              background: bg, border: `2px solid ${border}`, borderRadius: 14,
              padding: '14px 18px', color, fontSize: 15, cursor: selected !== null ? 'default' : 'pointer',
              transition: 'all .2s', fontFamily: "'DM Sans',sans-serif", textAlign: 'left',
            }}>
              {opt}
            </button>
          )
        })}
      </div>

      <FeedbackBanner state={feedback} text={q.tip} onNext={next} />
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN LEVEL PAGE
// ════════════════════════════════════════════════════════════════════════════

export default function LevelGame() {
  const router = useRouter()
  const { n: levelStr, tripId } = router.query

  const levelNum = parseInt(levelStr)
  const meta = LEVEL_META[levelNum]
  const phase = meta ? PHASES.find(p => p.id === meta.phase) : null

  const [trip, setTrip] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Game state
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState({ correct: 0, total: 0 })
  const [xpEarned, setXpEarned] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isPerfect, setIsPerfect] = useState(false)

  useEffect(() => {
    if (!tripId || !levelNum) return
    // Load trip
    const trips = JSON.parse(localStorage.getItem('ss_trips') || '[]')
    const t = trips.find(x => x.id === tripId)
    if (!t) { router.push('/planner'); return }
    setTrip(t)

    // Check cache
    const cached = JSON.parse(localStorage.getItem('ss_planner_' + tripId) || '{}')
    if (cached[levelNum]?.gameData) {
      setGameData(cached[levelNum].gameData)
      setLoading(false)
      return
    }

    // Fetch from API
    fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: levelNum,
        dest: t.dest,
        country: t.country,
        travelDate: new Date(t.travelDate).toLocaleDateString('en', { month: 'long', year: 'numeric' }),
        homecity: t.homecity,
        days: t.days,
      }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          setGameData(res.data)
          // Cache it
          const fresh = JSON.parse(localStorage.getItem('ss_planner_' + tripId) || '{}')
          fresh[levelNum] = { ...fresh[levelNum], gameData: res.data }
          localStorage.setItem('ss_planner_' + tripId, JSON.stringify(fresh))
        } else {
          setLoadError(res.error || 'Could not load level. Try again.')
        }
        setLoading(false)
      })
      .catch(() => { setLoadError('Connection error. Try again.'); setLoading(false) })
  }, [tripId, levelNum])

  function handleWrongAnswer() {
    const newLives = lives - 1
    setLives(newLives)
    if (newLives <= 0) {
      setTimeout(() => setGameOver(true), 800)
    }
  }

  function handleComplete(correct, total) {
    const perfect = correct === total && lives === 3
    const xp = (correct / total) * meta.xp + (perfect ? 50 : 0)
    setFinalScore({ correct, total })
    setXpEarned(Math.round(xp))
    setIsPerfect(perfect)
    setCompleted(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)

    // Save progress
    const cached = JSON.parse(localStorage.getItem('ss_planner_' + tripId) || '{}')
    cached[levelNum] = {
      ...cached[levelNum],
      complete: true,
      xpEarned: Math.round(xp),
      perfect,
      completedAt: Date.now(),
    }
    localStorage.setItem('ss_planner_' + tripId, JSON.stringify(cached))

    // Update total XP
    const totalXP = parseInt(localStorage.getItem('ss_total_xp') || '0') + Math.round(xp)
    localStorage.setItem('ss_total_xp', totalXP.toString())

    // Update streak
    const today = new Date().toDateString()
    const lastDay = localStorage.getItem('ss_streak_day')
    if (lastDay !== today) {
      const streak = lastDay === new Date(Date.now() - 86400000).toDateString()
        ? parseInt(localStorage.getItem('ss_streak') || '0') + 1 : 1
      localStorage.setItem('ss_streak', streak.toString())
      localStorage.setItem('ss_streak_day', today)
    }
  }

  function retry() {
    setLives(3); setGameOver(false); setCompleted(false)
    setFinalScore({ correct: 0, total: 0 }); setXpEarned(0)
  }

  if (!meta) return <div style={{ background: 'var(--ink)', minHeight: '100vh' }} />

  const phaseColor = phase?.color || 'var(--amber)'

  // ── LOADING ──
  if (loading) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24 }}>
      <span style={{ fontSize: 52 }}>{meta.emoji}</span>
      <div className="spinner" style={{ width: 32, height: 32, borderTopColor: phaseColor }} />
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--sand)', textAlign: 'center' }}>Building your {meta.title.toLowerCase()}…</p>
      <p style={{ fontSize: 13, color: 'var(--mist)' }}>AI is researching {trip?.dest} for you</p>
    </div>
  )

  // ── ERROR ──
  if (loadError) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
      <p style={{ fontSize: 40 }}>⚠️</p>
      <p style={{ fontSize: 16, color: 'var(--sand)' }}>{loadError}</p>
      <button className="btn-primary" onClick={() => { setLoadError(''); setLoading(true); retry() }}>Try Again</button>
      <button className="btn-back" onClick={() => router.push('/planner/' + tripId)}>← Back</button>
    </div>
  )

  // ── GAME OVER ──
  if (gameOver) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24, textAlign: 'center' }}>
      <span style={{ fontSize: 60 }}>💔</span>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: 'var(--sand)' }}>Out of lives</h2>
      <p style={{ fontSize: 14, color: 'var(--mist)', maxWidth: 280 }}>You ran out of hearts. Try again — you'll remember more this time.</p>
      <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={retry}>Try Again</button>
      <button className="btn-back" onClick={() => router.push('/planner/' + tripId)}>← Back to Trip</button>
    </div>
  )

  // ── COMPLETION ──
  if (completed) return (
    <>
      <Confetti active={showConfetti} />
      <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, padding: 24, textAlign: 'center' }}>
        <span style={{ fontSize: 72, marginBottom: 16 }}>{isPerfect ? '🏆' : '✅'}</span>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: 'var(--sand)', marginBottom: 8 }}>
          {isPerfect ? 'Perfect!' : 'Level Complete!'}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--mist)', marginBottom: 32 }}>
          {finalScore.correct} / {finalScore.total} correct · {lives} ❤️ remaining
        </p>

        {/* XP earned */}
        <div style={{ background: 'linear-gradient(135deg,rgba(232,146,74,.2),rgba(232,146,74,.05))', border: '2px solid rgba(232,146,74,.4)', borderRadius: 20, padding: '24px 40px', marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>XP EARNED</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>+{xpEarned}</p>
          {isPerfect && <p style={{ fontSize: 12, color: 'var(--amber)', marginTop: 6 }}>+50 perfect bonus ⭐</p>}
        </div>

        {/* Next level or back */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
          {levelNum < 8 && LEVEL_META[levelNum + 1] && (
            <button className="btn-primary" style={{ padding: '16px 0' }}
              onClick={() => router.push(`/planner/${tripId}/level/${levelNum + 1}`)}>
              Next: {LEVEL_META[levelNum + 1].emoji} {LEVEL_META[levelNum + 1].title} →
            </button>
          )}
          <button className="btn-back" style={{ alignSelf: 'center' }} onClick={() => router.push('/planner/' + tripId)}>
            ← Back to Trip Map
          </button>
        </div>
      </div>
    </>
  )

  // ── ACTIVE GAME ──
  const gameType = meta.game

  return (
    <>
      <Head><title>{meta.title} — {trip?.dest} — SoulScape</title></Head>
      <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: 'max(16px,calc(var(--st)+10px)) 18px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(240,235,224,.06)', flexShrink: 0 }}>
          <button className="btn-back" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => router.push('/planner/' + tripId)}>✕</button>
          <ProgressBar current={0} total={1} color={phaseColor} />
          <Lives count={lives} />
        </div>

        {/* Level title */}
        <div style={{ padding: '16px 22px 8px', flexShrink: 0 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: phaseColor, fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>
            {phase?.emoji} {phase?.name} · Level {levelNum}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--sand)' }}>{meta.title}</h1>
        </div>

        {/* Game area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 120px', WebkitOverflowScrolling: 'touch', maxWidth: 560, width: '100%', margin: '0 auto' }}>
          {gameType === 'quiz' && gameData && (
            <QuizGame data={gameData} levelMeta={meta} onComplete={handleComplete} onWrongAnswer={handleWrongAnswer} />
          )}
          {gameType === 'truefalse' && gameData && (
            <TrueFalseGame data={gameData} onComplete={handleComplete} onWrongAnswer={handleWrongAnswer} />
          )}
          {gameType === 'match' && gameData && (
            <MatchGame data={gameData} onComplete={handleComplete} onWrongAnswer={handleWrongAnswer} />
          )}
          {gameType === 'flashcard' && gameData && (
            <FlashcardGame data={gameData} onComplete={handleComplete} onWrongAnswer={handleWrongAnswer} />
          )}
          {gameType === 'fillblank' && gameData && (
            <FillBlankGame data={gameData} onComplete={handleComplete} onWrongAnswer={handleWrongAnswer} />
          )}
        </div>
      </div>
    </>
  )
}
