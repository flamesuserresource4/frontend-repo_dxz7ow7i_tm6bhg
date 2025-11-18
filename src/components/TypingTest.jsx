import { useEffect, useMemo, useRef, useState } from 'react'

const QUOTES = [
  'Simplicity is the soul of efficiency.',
  'First, solve the problem. Then, write the code.',
  'Programs must be written for people to read.',
  'Premature optimization is the root of all evil.',
  'Talk is cheap. Show me the code.',
  'Code is like humor. When you have to explain it, it’s bad.',
]

function useStopwatch(active) {
  const [elapsed, setElapsed] = useState(0)
  const raf = useRef(null)
  const startRef = useRef(0)

  useEffect(() => {
    if (!active) return
    startRef.current = performance.now() - elapsed
    const loop = (t) => {
      setElapsed(t - startRef.current)
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [active])

  return { elapsed, reset: () => setElapsed(0) }
}

function TypingTest({ onFinish }) {
  const [seed, setSeed] = useState(0)
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [mode, setMode] = useState('time')
  const [seconds, setSeconds] = useState(60)
  const [mistakes, setMistakes] = useState(0)

  const target = useMemo(() => {
    const base = QUOTES[(seed + 3) % QUOTES.length]
    return base.repeat(6).slice(0, 220)
  }, [seed])

  const { elapsed } = useStopwatch(isRunning && !isDone)
  const timeLeft = Math.max(0, seconds - Math.floor(elapsed / 1000))

  useEffect(() => {
    if (!isRunning && input.length > 0) setIsRunning(true)
  }, [input, isRunning])

  useEffect(() => {
    if (mode === 'time' && isRunning && timeLeft === 0) {
      finish()
    }
  }, [timeLeft, isRunning, mode])

  const accuracy = useMemo(() => {
    const correct = input.split('').filter((ch, i) => ch === target[i]).length
    const total = input.length
    if (total === 0) return 100
    return Math.max(0, Math.round(((correct - mistakes) / Math.max(1, total)) * 100))
  }, [input, target, mistakes])

  const wpm = useMemo(() => {
    const minutes = Math.max(1 / 60, (elapsed || 1) / 60000)
    const words = input.length / 5
    return Math.max(0, Math.round(words / minutes))
  }, [elapsed, input.length])

  const finish = () => {
    setIsDone(true)
    setIsRunning(false)
    const payload = {
      session_id: crypto.randomUUID(),
      duration_seconds: seconds,
      wpm,
      accuracy,
      characters_typed: input.length,
      words_typed: Math.round(input.length / 5),
      errors: mistakes,
      quote_length: target.length,
      mode,
      language: 'en',
    }
    onFinish?.(payload)
  }

  const restart = () => {
    setSeed((s) => s + 1)
    setInput('')
    setIsRunning(false)
    setIsDone(false)
    setMistakes(0)
  }

  const handleChange = (e) => {
    const v = e.target.value
    const nextIndex = v.length - 1
    if (target[nextIndex] && v[nextIndex] !== target[nextIndex]) {
      setMistakes((m) => m + 1)
    }
    setInput(v)
  }

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 text-xs">
          <button onClick={() => setSeconds(15)} className={`px-3 py-1 rounded-full border ${seconds===15?'border-slate-300 text-slate-200':'border-slate-700 text-slate-400'}`}>15s</button>
          <button onClick={() => setSeconds(30)} className={`px-3 py-1 rounded-full border ${seconds===30?'border-slate-300 text-slate-200':'border-slate-700 text-slate-400'}`}>30s</button>
          <button onClick={() => setSeconds(60)} className={`px-3 py-1 rounded-full border ${seconds===60?'border-slate-300 text-slate-200':'border-slate-700 text-slate-400'}`}>60s</button>
        </div>
        <div className="text-sm text-slate-300/80">Time left: <span className="font-mono">{timeLeft}s</span></div>
      </div>

      <div className="mb-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
        <p className="text-slate-400 text-sm mb-2">Type the text below</p>
        <div className="font-mono text-slate-100/90 text-lg leading-relaxed">
          {target.split('').map((ch, i) => {
            const typed = input[i]
            const state = typed == null ? 'pending' : typed === ch ? 'correct' : 'wrong'
            return (
              <span key={i} className={
                state === 'pending' ? 'text-slate-500' : state === 'correct' ? 'text-slate-100' : 'text-rose-400'
              }>{ch}</span>
            )
          })}
        </div>
      </div>

      <textarea
        value={input}
        onChange={handleChange}
        disabled={isDone}
        autoFocus
        placeholder="Start typing..."
        className="w-full h-28 sm:h-32 resize-none rounded-xl bg-slate-950/70 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-100 font-mono p-4 placeholder:text-slate-600"
      />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric label="WPM" value={wpm} />
        <Metric label="Accuracy" value={`${accuracy}%`} />
        <Metric label="Chars" value={input.length} />
        <Metric label="Errors" value={mistakes} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        {!isDone ? (
          <button onClick={finish} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-900 hover:bg-white transition">Finish</button>
        ) : (
          <button onClick={restart} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-900 hover:bg-white transition">Try Again</button>
        )}
        <button onClick={restart} className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800/60">New Text</button>
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-mono text-slate-100">{value}</div>
    </div>
  )
}

export default TypingTest
