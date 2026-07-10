import { useMemo } from 'react'
import { formatLabel, todayKey, addDays } from '../utils/dateUtils'
import { dayStats } from '../utils/stats'
import TaskItem from './TaskItem'
import DisciplineRing from './DisciplineRing'

export default function TodayView({ tasks, dateKey, setDateKey, onToggle, onEdit, onDelete, onForward, onAdd }) {
  const dayTasks = useMemo(() => tasks.filter((t) => t.date === dateKey || t.forwardedTo === dateKey).sort((a, b) => a.start.localeCompare(b.start)), [tasks, dateKey])
  const stats = useMemo(() => dayStats(tasks, dateKey), [tasks, dateKey])
  
  // Fake streak for demo
  const streak = 0
  const isToday = dateKey === todayKey()

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setDateKey((d) => addDays(d, -1))} className="rounded-full bg-white border border-slate-200 p-2.5 text-slate-500 shadow-sm transition-transform active:scale-90 active:bg-slate-50">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="text-center">
          <h2 className="font-display text-[18px] font-bold tracking-tight text-slate-900">{formatLabel(dateKey, { day: 'numeric', month: 'long', weekday: 'long' }).split(',')[0]}</h2>
          <p className="text-[12px] font-semibold text-slate-500">{formatLabel(dateKey, { month: 'short' })}</p>
        </div>
        <button onClick={() => setDateKey((d) => addDays(d, 1))} className="rounded-full bg-white border border-slate-200 p-2.5 text-slate-500 shadow-sm transition-transform active:scale-90 active:bg-slate-50">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="relative flex items-center justify-between overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative z-10 flex w-full items-center justify-between">
          <DisciplineRing pct={stats.pct} size={112} />
          <div className="flex-1 pl-6">
            <p className="font-mono text-3xl font-bold tracking-tight text-slate-900">
              {stats.done}<span className="text-slate-400 text-xl">/{stats.assigned}</span>
            </p>
            <p className="text-[13px] font-medium text-slate-500">tasks completed</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-600 border border-indigo-100">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1c1 3-3 4-3 7a3 3 0 006 0c0-1-.5-2-1-2.5.5 1.5-1.5 2-1.5.5C8.5 4 9 2.5 8 1z"/></svg>
              <span className="text-[11px] font-bold uppercase tracking-wider">{streak}-day streak</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[15px] font-bold text-slate-900">{isToday ? "Today's Activity" : `${formatLabel(dateKey, { month: 'short', day: 'numeric' })} Activity`}</h3>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-transform active:scale-95 hover:bg-amber-700"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Add task
          </button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <p className="text-[14px] font-medium text-slate-500">{isToday ? "No tasks assigned for today." : "No tasks assigned for this date."}</p>
            <button onClick={onAdd} className="mt-4 font-semibold text-amber-600 text-[14px] hover:text-amber-700 transition-colors">
              Add your first task →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dayTasks.map((t) => (
              <TaskItem 
                key={t.id} 
                task={t} 
                onToggle={() => onToggle(t.id)} 
                onEdit={() => onEdit(t)} 
                onDelete={() => onDelete(t.id)} 
                onForward={() => onForward(t.id, addDays(dateKey, 1))}
                isForwarded={t.date !== dateKey}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
