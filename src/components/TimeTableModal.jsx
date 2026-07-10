import { useEffect, useState, useMemo } from 'react'
import { getCategories, addCustomCategory } from '../utils/categories'
import ClockPicker from './ClockPicker'

function formatTimeLabel(val) {
  const [hh, mm] = val.split(':')
  const h = parseInt(hh, 10)
  const ampm = h < 12 ? 'AM' : 'PM'
  const dispH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${String(dispH).padStart(2, '0')}:${mm} ${ampm}`
}

const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TimeTableModal({ open, onClose, onSave, initial, dayIndex }) {
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')
  const [category, setCategory] = useState('other')
  const [customCatName, setCustomCatName] = useState('')
  const [error, setError] = useState('')
  const [pickerTarget, setPickerTarget] = useState(null)

  const categories = useMemo(() => getCategories(), [open])

  useEffect(() => {
    if (open) {
      setStart(initial?.start || '09:00')
      setEnd(initial?.end || '10:00')
      setCategory(initial?.category || 'other')
      setCustomCatName('')
      setError('')
      setPickerTarget(null)
    }
  }, [open, initial])

  if (!open) return null

  function handleSave() {
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
      start,
      end,
      category: finalCat,
      dayIndex: initial?.dayIndex !== undefined ? initial.dayIndex : dayIndex,
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
            {initial?.id ? `Edit ${FULL_DAYS[dayIndex]} Schedule` : `Add to ${FULL_DAYS[dayIndex]} Schedule`}
          </h2>

          <div className="mt-5 space-y-5">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Start Time</label>
                <button
                  type="button"
                  onClick={() => setPickerTarget('start')}
                  className="w-full text-left rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-medium text-slate-900 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                >
                  {formatTimeLabel(start)}
                </button>
              </div>
              <div className="flex-1 relative">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">End Time</label>
                <button
                  type="button"
                  onClick={() => setPickerTarget('end')}
                  className="w-full text-left rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-medium text-slate-900 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                >
                  {formatTimeLabel(end)}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject</label>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className="rounded-full px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: category === c.id ? c.color : `${c.color}15`,
                      color: category === c.id ? '#FFFFFF' : c.color,
                      border: `1px solid ${category === c.id ? c.color : 'transparent'}`,
                    }}
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
                className="flex-1 rounded-[16px] bg-indigo-600 py-4 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
              >
                {initial?.id ? 'Save schedule' : 'Add to schedule'}
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
