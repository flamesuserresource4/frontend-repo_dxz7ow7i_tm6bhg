import Spline from '@splinetool/react-spline';

function Header() {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/fcD-iW8YZHyBp1qq/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="w-full p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl text-slate-100 tracking-tight font-semibold">MonoType — Typing Speed Test</h1>
              <p className="text-slate-300/80 text-sm mt-1">Practice. Measure. Improve. Focused, monotone UI with clean stats.</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-2 text-xs text-slate-300/70 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live metrics enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay (non-blocking) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
    </div>
  );
}

export default Header;
