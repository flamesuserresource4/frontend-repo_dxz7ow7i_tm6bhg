import { useEffect, useState } from 'react'

function StatsPanel() {
  const [history, setHistory] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/results?limit=20`).then(r => r.json()).then(setHistory).catch(() => setHistory([]))
  }, [])

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-100 font-semibold tracking-tight">Recent Results</h3>
        <span className="text-xs text-slate-400">Last 20</span>
      </div>

      {history.length === 0 ? (
        <p className="text-slate-400 text-sm">No results yet. Complete a test to see your stats here.</p>
      ) : (
        <div className="space-y-3">
          {history.map((r) => (
            <div key={r.id} className="grid grid-cols-3 sm:grid-cols-6 gap-2 items-center rounded-xl bg-slate-800/60 border border-slate-700/60 p-3">
              <div className="text-slate-100 font-mono">{r.wpm}</div>
              <div className="text-slate-300 text-sm">{r.accuracy}%</div>
              <div className="text-slate-300 text-sm hidden sm:block">{r.words_typed}w</div>
              <div className="text-slate-300 text-sm hidden sm:block">{r.errors} err</div>
              <div className="text-slate-400 text-xs col-span-2 sm:col-span-1">{new Date(r.created_at || r.updated_at || Date.now()).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatsPanel
