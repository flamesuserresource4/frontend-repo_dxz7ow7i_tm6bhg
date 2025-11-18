import Header from './components/Header'
import TypingTest from './components/TypingTest'
import StatsPanel from './components/StatsPanel'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleFinish = async (payload) => {
    try {
      await fetch(`${baseUrl}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } catch (e) {
      console.error('Failed to save result', e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <Header />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <TypingTest onFinish={handleFinish} />
          </div>
          <div className="md:col-span-1">
            <StatsPanel />
          </div>
        </div>

        <footer className="mt-10 text-center text-slate-500 text-xs">
          Monotone theme • Typewriter aesthetics • Focus mode
        </footer>
      </div>
    </div>
  )
}

export default App
