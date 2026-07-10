const TABS = [
  { id: 'today', label: 'Today', icon: 'M4 3h12v2H4V3zm0 4h12v10H4V7zm2 3h3v3H6v-3z' },
  { id: 'week', label: 'Week', icon: 'M3 4h14v2H3V4zm0 4h3v9H3V8zm5 0h3v9H8V8zm5 0h3v9h-3V8z' },
  { id: 'month', label: 'Month', icon: 'M4 3h12v2H4V3zm0 4h3v3H4V7zm5 0h3v3H9V7zm5 0h3v3h-3V7zM4 12h3v3H4v-3zm5 0h3v3H9v-3zm5 0h3v3h-3v-3z' },
  { id: 'timetable', label: 'Schedule', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  { id: 'stats', label: 'Report', icon: 'M4 15V9h2v6H4zm5 0V4h2v11H9zm5 0v-8h2v8h-2z' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md bg-white/80 pb-6 pt-4 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex w-[calc(100%-2rem)] max-w-[360px] items-center justify-between rounded-full bg-slate-50 border border-slate-200 p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-2.5 transition-all active:scale-95 ${
                isActive ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100/50'
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill={isActive ? '#4F46E5' : '#94A3B8'} className="transition-colors duration-300">
                <path d={tab.icon} />
              </svg>
              <span className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
