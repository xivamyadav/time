import { useEffect, useState, useMemo } from 'react'
import { getCategories, addCustomCategory } from '../utils/categories'
import ClockPicker from './ClockPicker'

const TIME_OPTIONS = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const ampm = h < 12 ? 'AM' : 'PM'
    const dispH = h === 0 ? 12 : h > 12 ? h - 12 : h
    const label = `${String(dispH).padStart(2, '0')}:${mm} ${ampm}`
    TIME_OPTIONS.push({ value: `${hh}:${mm}`, label })
  }
}

function getRoundedCurrentTime() {
  const d = new Date()
  let h = d.getHours()
  let m = d.getMinutes()
  
  m = Math.ceil(m / 15) * 15
  if (m === 60) {
    m = 0
    h += 1
  }
  if (h === 24) h = 0
  
  const startStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  let endH = h + 1
  if (endH >= 24) endH = 0
  const endStr = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  
  return { start: startStr, end: endStr }
}

function formatTimeLabel(val) {
  const [hh, mm] = val.split(':')
  const h = parseInt(hh, 10)
  const ampm = h < 12 ? 'AM' : 'PM'
  const dispH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${String(dispH).padStart(2, '0')}:${mm} ${ampm}`
}

export default function TaskModal({ open, onClose, onSave, initial, dateKey }) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')
  const [category, setCategory] = useState('other')
  const [customCatName, setCustomCatName] = useState('')
  const [error, setError] = useState('')
  const [pickerTarget, setPickerTarget] = useState(null) // 'start' | 'end' | null

  const categories = useMemo(() => getCategories(), [open])

  useEffect(() => {
    if (open) {
      const { start: defaultStart, end: defaultEnd } = getRoundedCurrentTime()
      setTitle(initial?.title || '')
      setStart(initial?.start || defaultStart)
      setEnd(initial?.end || defaultEnd)
      setCategory(initial?.category || 'other')
      setCustomCatName('')
      setError('')
      setPickerTarget(null)
    }
  }, [open, initial])

  if (!open) return null

  function handleSave() {
    if (!title.trim()) {
      setError('Please enter a task name')
      return
    }
    if (end <= start) {
      setError('End time must be after start time')
      return
    }

    let finalCat = category
    if (category === 'other' && customCatName.trim()) {
      const newCat = addCustomCategory(customCatName.trim())
      finalCat = newCat.id
    }

    onSave({
      id: initial?.id,
      title: title.trim(),
      start,
      end,
      category: finalCat,
      date: initial?.date || dateKey,
      completed: initial?.completed || false,
    })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-all" onClick={onClose}>
        <div
          className="w-full max-w-md animate-rise rounded-t-[32px] border-t border-slate-200 bg-white p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />
          <h2 className="font-display text-[20px] font-bold tracking-tight text-slate-900">
            {initial?.id ? 'Edit task' : 'Assign new task'}
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Task Title</label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. History Chapter 4"
                className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Start Time</label>
                <button
                  onClick={() => setPickerTarget('start')}
                  className="w-full text-left rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-medium text-slate-900 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                >
                  {formatTimeLabel(start)}
                </button>
                <div className="pointer-events-none absolute inset-y-0 right-4 top-[26px] flex items-center text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">End Time</label>
                <button
                  onClick={() => setPickerTarget('end')}
                  className="w-full text-left rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-medium text-slate-900 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                >
                  {formatTimeLabel(end)}
                </button>
                <div className="pointer-events-none absolute inset-y-0 right-4 top-[26px] flex items-center text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject</label>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`rounded-full px-4 py-2 text-[12px] font-bold transition-all active:scale-95 border ${
                      category === c.id 
                        ? 'shadow-sm border-slate-300' 
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                    style={category === c.id ? { backgroundColor: c.color, color: '#0F172A' } : undefined}
                  >
                    {c.label === 'Other' && category === 'other' ? '+ Add Subject' : c.label}
                  </button>
                ))}
              </div>
              {category === 'other' && (
                <div className="mt-3 animate-rise">
                  <input
                    value={customCatName}
                    onChange={(e) => setCustomCatName(e.target.value)}
                    placeholder="Enter new subject name..."
                    className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-red-50 px-4 py-3 text-red-600 border border-red-100 animate-rise">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-[13px] font-bold">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-[16px] border border-slate-200 bg-white py-4 text-[14px] font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-[16px] bg-amber-600 py-4 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-95"
              >
                {initial?.id ? 'Save changes' : 'Add task'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {pickerTarget && (
        <ClockPicker 
          value={pickerTarget === 'start' ? start : end}
          onChange={(v) => pickerTarget === 'start' ? setStart(v) : setEnd(v)}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </>
  )
}
