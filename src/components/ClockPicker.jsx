import { useState, useEffect } from 'react'

export default function ClockPicker({ value, onChange, onClose }) {
  const [mode, setMode] = useState('hours') // 'hours' or 'minutes'
  
  // Parse initial value "HH:mm"
  const initialH = parseInt(value.split(':')[0], 10)
  const initialM = parseInt(value.split(':')[1], 10)
  
  const [hour, setHour] = useState(initialH % 12 || 12)
  const [minute, setMinute] = useState(initialM)
  const [ampm, setAmpm] = useState(initialH >= 12 ? 'PM' : 'AM')

  // Update parent when any value changes
  useEffect(() => {
    let h = hour
    if (ampm === 'PM' && h !== 12) h += 12
    if (ampm === 'AM' && h === 12) h = 0
    const hh = String(h).padStart(2, '0')
    const mm = String(minute).padStart(2, '0')
    onChange(`${hh}:${mm}`)
  }, [hour, minute, ampm])

  const r = 90 // clock radius
  const cx = 112 // center x (w-56 = 224px / 2 = 112)
  const cy = 112 // center y

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-[32px] shadow-2xl flex flex-col items-center animate-rise w-full max-w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Display */}
        <div className="flex items-baseline justify-center gap-2 mb-6 w-full bg-slate-50 py-4 rounded-[20px] border border-slate-100">
          <button 
            onClick={() => setMode('hours')}
            className={`text-4xl font-display font-bold transition-colors ${mode === 'hours' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {String(hour).padStart(2, '0')}
          </button>
          <span className="text-4xl font-display font-bold text-slate-300 mb-1">:</span>
          <button 
            onClick={() => setMode('minutes')}
            className={`text-4xl font-display font-bold transition-colors ${mode === 'minutes' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {String(minute).padStart(2, '0')}
          </button>
          <div className="flex flex-col ml-3 gap-1.5">
            <button 
              onClick={() => setAmpm('AM')}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${ampm === 'AM' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-200'}`}
            >
              AM
            </button>
            <button 
              onClick={() => setAmpm('PM')}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${ampm === 'PM' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-200'}`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock Face */}
        <div className="relative w-[224px] h-[224px] rounded-full bg-slate-50 border-[6px] border-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.05),0_5px_15px_rgba(0,0,0,0.05)]">
          {/* Center Dot */}
          <div className="absolute w-2 h-2 rounded-full bg-amber-500 left-1/2 top-1/2 -ml-1 -mt-1 z-10 shadow-sm" />
          
          {/* Clock Hand line (optional cool effect) */}
          <div 
            className="absolute h-[80px] w-0.5 bg-amber-400 left-1/2 top-1/2 origin-top opacity-50"
            style={{ 
              transform: `rotate(${mode === 'hours' ? (hour * 30 - 180) : (minute * 6 - 180)}deg)` 
            }}
          />

          {mode === 'hours' && hours.map((h, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = r * Math.cos(angle) + cx
            const y = r * Math.sin(angle) + cy
            const isSelected = hour === h
            return (
              <button
                key={h}
                onClick={() => { setHour(h); setTimeout(() => setMode('minutes'), 300) }}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center text-[15px] font-bold transition-all ${
                  isSelected ? 'bg-amber-500 text-white shadow-md scale-110' : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                }`}
                style={{ left: x, top: y }}
              >
                {h}
              </button>
            )
          })}

          {mode === 'minutes' && minutes.map((m, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = r * Math.cos(angle) + cx
            const y = r * Math.sin(angle) + cy
            const isSelected = minute === m
            return (
              <button
                key={m}
                onClick={() => setMinute(m)}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center text-[14px] font-bold transition-all ${
                  isSelected ? 'bg-amber-500 text-white shadow-md scale-110' : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                }`}
                style={{ left: x, top: y }}
              >
                {String(m).padStart(2, '0')}
              </button>
            )
          })}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-slate-900 text-white rounded-[16px] font-bold text-[15px] hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
        >
          Confirm Time
        </button>
      </div>
    </div>
  )
}
