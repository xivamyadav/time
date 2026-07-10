import { useMemo } from 'react'
import { weekDates, formatLabel, todayKey, addDays } from '../utils/dateUtils'
import { rangeStats } from '../utils/stats'
import DisciplineRing from './DisciplineRing'

export default function WeekView({ tasks, dateKey, setDateKey, goToday }) {
  const dates = useMemo(() => weekDates(dateKey), [dateKey])
  const stats = useMemo(() => rangeStats(tasks, dates), [tasks, dates])
  const today = todayKey()

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-8">
      <div className="mb-2">
        <h2 className="font-display text-[24px] font-bold tracking-tight text-slate-900">Your Week</h2>
        <p className="text-[14px] font-medium text-slate-500 mb-4">Track this week's progress</p>
        <div className="bg-indigo-50/50 p-4 rounded-[16px] border border-indigo-100">
          <p className="text-[13px] leading-relaxed text-slate-600 font-medium">
            <span className="font-bold text-indigo-700">Weekly Insight:</span> You have completed <span className="font-bold text-slate-900">{stats.done}</span> out of <span className="font-bold text-slate-900">{stats.assigned}</span> tasks scheduled for this week, maintaining a <span className="font-bold text-indigo-600">{stats.pct}%</span> consistency score.
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative z-10 flex w-full items-center gap-6">
          <DisciplineRing pct={stats.pct} size={100} />
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
              <span>Overall score</span>
              <span className="font-mono font-bold text-indigo-600">{stats.pct}%</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
              <span>Tasks done</span>
              <span className="font-mono font-bold text-slate-900">{stats.done}/{stats.assigned}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {dates.map((d) => {
          const s = stats.perDay.find((p) => p.date === d)
          const isToday = d === today
          const pct = s.pct
          const barColor = pct === null ? 'bg-slate-100' : pct >= 80 ? 'bg-mint-500' : pct >= 50 ? 'bg-indigo-600' : 'bg-coral-500'
          return (
            <button
              key={d}
              onClick={() => setDateKey(d)}
              className={`flex items-center gap-4 rounded-[20px] border p-4 text-left transition-all active:scale-[0.98] ${
                isToday ? 'border-indigo-200 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="w-12 shrink-0">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {formatLabel(d, { weekday: 'short' })}
                </p>
                <p className={`font-display text-[22px] font-bold ${isToday ? 'text-indigo-600' : 'text-slate-900'}`}>
                  {d.slice(-2).replace(/^0/, '')}
                </p>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex justify-between text-[12px] font-bold">
                  <span className={isToday ? 'text-indigo-600' : 'text-slate-600'}>Score</span>
                  <span className={isToday ? 'text-indigo-600' : 'text-slate-900'}>{pct === null ? '-' : `${pct}%`}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} style={{ width: `${pct || 0}%` }} />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button onClick={goToday} className="mt-4 self-center rounded-full bg-slate-100 px-6 py-2.5 text-[13px] font-bold tracking-wide text-slate-600 transition-all hover:bg-slate-200 active:scale-95">
        Jump to today
      </button>
    </div>
  )
}
