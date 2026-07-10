import { useMemo, useRef, useState } from 'react'
import { todayKey, addDays } from '../utils/dateUtils'
import { rangeStats, categoryBreakdown, currentStreak } from '../utils/stats'
import { categoryById } from '../utils/categories'
import { exportData, importData } from '../utils/storage'
import DisciplineRing from './DisciplineRing'

export default function StatsView({ tasks, reload }) {
  const fileRef = useRef(null)
  const [toast, setToast] = useState('')

  const last30 = useMemo(() => {
    const end = todayKey()
    return Array.from({ length: 30 }, (_, i) => addDays(end, -(29 - i)))
  }, [])

  const stats = useMemo(() => rangeStats(tasks, last30), [tasks, last30])
  const streak = useMemo(() => currentStreak(tasks), [tasks])
  const breakdown = useMemo(() => categoryBreakdown(tasks, last30), [tasks, last30])

  const sortedCats = Object.entries(breakdown).sort((a, b) => b[1].assigned - a[1].assigned)

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importData(file)
      reload()
      setToast('Backup restored successfully ✓')
    } catch {
      setToast('Import failed — check the file')
    }
    e.target.value = ''
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-8">
      <div className="mb-2">
        <h2 className="font-display text-[24px] font-bold tracking-tight text-slate-900">Your Report</h2>
        <p className="text-[14px] font-medium text-slate-500">Overall consistency & progress</p>
      </div>

      <div className="relative flex items-center gap-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative z-10 flex w-full items-center gap-6">
          <DisciplineRing pct={stats.pct} size={112} />
          <div className="flex-1 space-y-3">
            <Row label="Days studied" value={stats.studiedDays} accent="text-mint-500" />
            <Row label="Days wasted" value={stats.wastedDays} accent={stats.wastedDays > 0 ? 'text-coral-500' : 'text-slate-500'} />
            <Row label="Current streak" value={`${streak} days`} accent="text-indigo-600" />
            <Row label="Tasks done" value={`${stats.done}/${stats.assigned}`} />
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-display text-[15px] font-bold text-slate-900">Subject Breakdown</h3>
        {sortedCats.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 py-8 text-center">
            <p className="text-[13px] font-medium text-slate-500">No data available yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedCats.map(([id, v], index) => {
              const cat = categoryById(id)
              const pct = v.assigned ? Math.round((v.done / v.assigned) * 100) : 0
              return (
                <div key={id} className={`pb-4 ${index !== sortedCats.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</span>
                    <span className="font-mono text-[13px] font-semibold text-slate-900">{v.done}<span className="text-slate-400 font-medium">/{v.assigned}</span></span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-display text-[15px] font-bold text-slate-900">Data & Backup</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">Data is saved locally in your browser. Export and import your backup to transfer to another device.</p>
        <div className="mt-4 flex gap-3">
          <button onClick={exportData} className="flex-1 rounded-[14px] border border-slate-200 bg-slate-50 py-3 text-[13px] font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-100">
            Export data
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 rounded-[14px] bg-indigo-50 py-3 text-[13px] font-semibold text-indigo-600 border border-indigo-100 transition-all active:scale-95 hover:bg-indigo-100">
            Import backup
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </div>
        {toast && <p className="mt-3 text-center text-[12px] font-medium text-mint-500 animate-rise">{toast}</p>}
      </div>
    </div>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold text-slate-500">{label}</span>
      <span className={`font-mono text-[14px] font-bold ${accent || 'text-slate-900'}`}>{value}</span>
    </div>
  )
}
