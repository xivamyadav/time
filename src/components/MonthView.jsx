import { useMemo, useState } from 'react'
import { monthGrid, monthLabel, todayKey, addDays, WEEKDAY_LABELS, formatLabel } from '../utils/dateUtils'
import { dayStats, rangeStats } from '../utils/stats'
import DisciplineRing from './DisciplineRing'

function shiftMonth(dateKey, n) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const dt = new Date(y, m - 1 + n, 1)
  const ny = dt.getFullYear()
  const nm = String(dt.getMonth() + 1).padStart(2, '0')
  const nd = String(dt.getDate()).padStart(2, '0')
  return `${ny}-${nm}-${nd}`
}

export default function MonthView({ tasks, dateKey, setDateKey, setActiveTab }) {
  const [selectedDay, setSelectedDay] = useState(null)
  const cells = useMemo(() => monthGrid(dateKey), [dateKey])
  const validDates = useMemo(() => cells.filter(Boolean), [cells])
  const monthStats = useMemo(() => rangeStats(tasks, validDates), [tasks, validDates])
  const selectedStats = useMemo(() => selectedDay ? dayStats(tasks, selectedDay) : null, [tasks, selectedDay])
  const today = todayKey()

  function cellColor(dk) {
    if (!dk) return 'transparent'
    const s = dayStats(tasks, dk)
    if (s.assigned === 0) return '#F1F5F9' // slate-100
    if (s.pct >= 80) return '#10B981' // mint-500
    if (s.pct >= 50) return '#4F46E5' // indigo-600
    if (s.pct > 0) return '#F87171'   // coral-400
    return '#FEF2F2'
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-8">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-tight text-slate-900">Your Calendar</h2>
          <p className="text-[14px] font-medium text-slate-500">Track your long-term progress</p>
        </div>
        {selectedDay && (
          <button onClick={() => setSelectedDay(null)} className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 active:scale-95 transition-transform bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            Clear Selection
          </button>
        )}
      </div>

      <div className="relative flex items-center gap-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all">
        <div className="relative z-10 flex w-full items-center gap-6">
          <DisciplineRing pct={selectedStats ? selectedStats.pct : monthStats.pct} size={100} />
          <div className="flex-1 space-y-2.5">
            <h3 className="font-display text-[15px] font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">
              {selectedDay ? `${formatLabel(selectedDay, { day: 'numeric', month: 'short' })} Report` : "Month Report"}
            </h3>
            <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
              <span>Overall score</span>
              <span className="font-mono font-bold text-indigo-600">{selectedStats ? selectedStats.pct : monthStats.pct}%</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
              <span>Tasks done</span>
              <span className="font-mono font-bold text-slate-900">{selectedStats ? selectedStats.done : monthStats.done}/{selectedStats ? selectedStats.assigned : monthStats.assigned}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => { setDateKey(shiftMonth(dateKey, -1)); setSelectedDay(null); }} 
            disabled={dateKey.slice(0, 7) <= today.slice(0, 7)}
            className={`rounded-full p-2 transition-all ${
              dateKey.slice(0, 7) > today.slice(0, 7) 
                ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:scale-90' 
                : 'text-slate-200 cursor-not-allowed'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L5 10l7 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="font-display text-[16px] font-bold tracking-wide text-slate-900">{monthLabel(dateKey)}</span>
          <button onClick={() => { setDateKey(shiftMonth(dateKey, 1)); setSelectedDay(null); }} className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:scale-90 transition-all">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4l7 6-7 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase text-slate-400">
          {WEEKDAY_LABELS.map(w => <div key={w}>{w}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((dk, i) => {
            if (!dk) return <div key={i} />
            const isToday = dk === today
            const isSelected = dk === selectedDay
            return (
              <button
                key={dk + i}
                onClick={() => setSelectedDay(dk === selectedDay ? null : dk)}
                className={`relative aspect-square rounded-[12px] text-[13px] font-bold transition-all active:scale-90 ${
                  isToday ? 'ring-2 ring-slate-300 ring-offset-2 ring-offset-white' : ''
                } ${
                  isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 ring-offset-white shadow-sm z-10 scale-105' : ''
                }`}
                style={{
                  backgroundColor: cellColor(dk),
                  color: ['#F1F5F9', '#F8FAFC', '#FEF2F2', 'transparent'].includes(cellColor(dk)) ? '#94A3B8' : '#FFFFFF'
                }}
              >
                {dk.slice(-2).replace(/^0/, '')}
              </button>
            )
          })}
        </div>
      </div>
      
      <button onClick={() => { setDateKey(today); setSelectedDay(null); }} className="self-center rounded-full bg-slate-100 px-6 py-2.5 text-[13px] font-bold tracking-wide text-slate-600 transition-all hover:bg-slate-200 active:scale-95">
        Jump to today
      </button>
    </div>
  )
}
