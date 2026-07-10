import { useState, useEffect } from 'react'
import ClockPicker from './ClockPicker'

function formatTimeLabel(val) {
  const [hh, mm] = val.split(':')
  const h = parseInt(hh, 10)
  const ampm = h < 12 ? 'AM' : 'PM'
  const dispH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${String(dispH).padStart(2, '0')}:${mm} ${ampm}`
}

export default function GridSlotModal({ open, slot, onClose, onSave, onDelete }) {
  const [start, setStart] = useState('06:00')
  const [end, setEnd] = useState('08:00')
  const [pickerTarget, setPickerTarget] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open && slot) {
      setStart(slot.start)
      setEnd(slot.end)
      setError('')
      setPickerTarget(null)
    }
  }, [open, slot])

  if (!open) return null

  function handleSave() {
    if (end <= start) {
      setError('End time must be after start time')
      return
    }
    onSave(slot.id, start, end)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all" onClick={onClose}>
        <div
          className="w-full max-w-sm animate-rise rounded-[32px] bg-white p-6 shadow-2xl relative m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-display text-[20px] font-bold tracking-tight text-slate-900 mb-5">
            Edit Time Slot
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Start Time</label>
                <button
                  type="button"
                  onClick={() => setPickerTarget('start')}
                  className="w-full text-left rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-medium text-slate-900 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                >
                  {formatTimeLabel(start)}
                </button>
              </div>
              <div className="flex-1 relative">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">End Time</label>
                <button
                  type="button"
                  onClick={() => setPickerTarget('end')}
                  className="w-full text-left rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-medium text-slate-900 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:outline-none"
                >
                  {formatTimeLabel(end)}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-red-50 px-4 py-3 text-red-600 border border-red-100 animate-rise">
                <p className="text-[13px] font-bold">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onDelete(slot.id)}
                className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3.5 text-[14px] font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-[16px] border border-slate-200 bg-white py-3.5 text-[14px] font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-[16px] bg-indigo-600 py-3.5 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
              >
                Save
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
