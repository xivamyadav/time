import { useState, useMemo, useEffect } from 'react'
import { getCategories } from '../utils/categories'
import { getTimetable, addTimetableBlock, removeTimetableBlock, getGridSlots, updateGridSlot, removeGridSlot } from '../utils/timetableUtils'
import { loadTasks } from '../utils/storage'
import { todayKey } from '../utils/dateUtils'
import { dayStats } from '../utils/stats'
import TimeTableModal from './TimeTableModal'
import GridSlotModal from './GridSlotModal'
import { Sparkles, Plus, X, Search, SlidersHorizontal, User } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DATES = ['13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May']

function formatTimeOnly(val) {
  const [hh, mm] = val.split(':')
  return `${hh}:${mm}`
}

function NotoEmoji({ code, className }) {
  return <img src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/emoji.svg`} className={className} alt="" crossOrigin="anonymous" />
}

function getSubjectProps(catId) {
  const map = {
    'polity': { emoji: '1f3e8', bg: '#F8F1F9', text: '#7E4C4C' },
    'history': { emoji: '1f3db', bg: '#FFF0F5', text: '#5B4B75' },
    'geography': { emoji: '1f30d', bg: '#F0FAFF', text: '#3E667E' },
    'economy': { emoji: '1f4ca', bg: '#FEFAED', text: '#7B663A' },
    'gs1': { emoji: '1f3db', bg: '#FFF0F5', text: '#5B4B75' },
    'gs2': { emoji: '1f3e8', bg: '#F8F1F9', text: '#7E4C4C' },
    'gs3': { emoji: '1f30d', bg: '#F0FAFF', text: '#3E667E' },
    'gs4': { emoji: '1f9d8', bg: '#FEFAED', text: '#7B663A' },
    'optional': { emoji: '1f4d4', bg: '#F4F6F8', text: '#4A5568' },
    'essay': { emoji: '1f4dd', bg: '#F8F9FA', text: '#4A5568' },
    'csat': { emoji: '1f9e0', bg: '#F5F5FA', text: '#5D5D8A' },
    'current': { emoji: '1f4f0', bg: '#F4FAF8', text: '#4B7369' },
    'answer': { emoji: '270d', bg: '#EDFDF9', text: '#3B7A6A' },
    'map': { emoji: '1f5fa', bg: '#FFF0F5', text: '#8A4A5A' },
    'revision': { emoji: '1f504', bg: '#FFF5F7', text: '#8A4A5A' },
    'test': { emoji: '1f4cb', bg: '#FFF7F0', text: '#8B5C3B' },
    'break': { emoji: '2615', bg: '#F8F9FC', text: '#64748B' },
    'other': { emoji: '2728', bg: '#F4F6F8', text: '#4A5568' }
  }
  return map[catId] || map['other']
}

export default function TimeTableView({ onBack }) {
  const [timetable, setTimetable] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [activeDayForAdd, setActiveDayForAdd] = useState(0)
  const [inlineSelector, setInlineSelector] = useState(null)
  const [tasks, setTasks] = useState([])
  
  // Grid Slots state
  const [gridSlots, setGridSlots] = useState([])
  const [editingGridSlot, setEditingGridSlot] = useState(null)

  useEffect(() => {
    setTimetable(getTimetable())
    setCategories(getCategories())
    setGridSlots(getGridSlots())
    setTasks(loadTasks())
  }, [])

  const stats = useMemo(() => dayStats(tasks, todayKey()), [tasks])

  const timeRanges = useMemo(() => {
    const ranges = new Map()
    gridSlots.forEach(s => ranges.set(`${s.start}-${s.end}`, s))
    timetable.forEach(b => {
      const key = `${b.start}-${b.end}`
      if (!ranges.has(key)) {
        ranges.set(key, { id: 'custom-'+key, start: b.start, end: b.end, icon: '2728' })
      }
    })
    return Array.from(ranges.values()).sort((a, b) => a.start.localeCompare(b.start))
  }, [timetable, gridSlots])

  function handleSaveGridSlot(id, start, end) {
    const newSlots = updateGridSlot(id, start, end)
    setGridSlots(newSlots)
    setEditingGridSlot(null)
  }

  function handleDeleteGridSlot(id) {
    if (window.confirm('Delete this row from your timetable grid?')) {
      const newSlots = removeGridSlot(id)
      setGridSlots(newSlots)
      setEditingGridSlot(null)
    }
  }

  function handleSaveBlock(blockData) {
    const newTimetable = addTimetableBlock(blockData)
    setTimetable(newTimetable)
    setCategories(getCategories())
    setInlineSelector(null)
  }

  function handleDeleteBlock(id) {
    const newTimetable = removeTimetableBlock(id)
    setTimetable(newTimetable)
  }

  function openAddModal(dayIndex = 0) {
    setActiveDayForAdd(dayIndex)
    setModalOpen(true)
  }

  return (
    <div className="flex h-full flex-col pb-28 pt-8 animate-fade-in bg-[#FAFAFC] min-h-screen">      
      {/* Clean Header with Back Button */}
      <div className="px-5 mb-8 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
             </button>
             <div className="flex items-center gap-1.5">
                <img src="/custom-header.png" alt="Cute Bear" className="w-12 h-12 object-contain" />
                <h1 className="font-display text-[20px] font-extrabold tracking-tight text-[#1E293B] flex items-center gap-1.5 -ml-1">
                  My Timetable <NotoEmoji code="1f496" className="w-4 h-4" />
                </h1>
             </div>
           </div>
           
           <div className="flex items-center gap-2 shrink-0">
             <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-600">
               <Search className="w-4 h-4" />
             </button>
             <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-600">
               <SlidersHorizontal className="w-4 h-4" />
             </button>
             <div className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-50 border border-pink-100">
               <NotoEmoji code="1f430" className="w-5 h-5" />
             </div>
           </div>
        </div>
        <div className="pl-14">
           <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
             Plan your study. Achieve your dreams <NotoEmoji code="2728" className="w-3.5 h-3.5" />
           </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative px-4 pb-2">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 mb-6 flex justify-between p-2">
          {DAYS.map((day, dIdx) => {
            const isMon = dIdx === 0
            return (
              <div key={day} className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-[18px] transition-all ${isMon ? 'bg-[#8B7CF6] shadow-md' : 'text-slate-500'}`}>
                <span className={`text-[13px] font-bold ${isMon ? 'text-white' : 'text-slate-700'}`}>{day}</span>
                <span className={`text-[11px] font-medium ${isMon ? 'text-white/80' : 'text-slate-400'}`}>{DATES[dIdx]}</span>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-x-auto hide-scrollbar relative">
            <div className="min-w-[900px] pb-6">
              <div className="flex border-b border-slate-100 sticky top-0 bg-white z-20">
                <div className="w-[85px] shrink-0 sticky left-0 bg-white z-30 border-r border-slate-100/50 flex items-center justify-center py-4">
                  <span className="text-[12px] font-medium text-slate-400">Time</span>
                </div>
                {DAYS.map((day) => (
                  <div key={day} className="flex-1 min-w-[110px] py-4 flex items-center justify-center border-r border-transparent">
                    <span className={`text-[14px] font-bold ${day === 'Sat' ? 'text-blue-400' : day === 'Sun' ? 'text-rose-400' : 'text-[#1E293B]'}`}>{day}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                {timeRanges.map((range) => {
                  const blocksInRow = timetable.filter(b => b.start === range.start && b.end === range.end)
                  const breakBlock = blocksInRow.find(b => b.category === 'break' || range.isBreak)
                  const isBreakRow = !!breakBlock || range.isBreak
                  
                  return (
                    <div key={`${range.start}-${range.end}`} className="flex border-b border-slate-50 min-h-[100px]">
                      <div 
                        onClick={() => range.id && setEditingGridSlot(range)}
                        className={`w-[85px] shrink-0 sticky left-0 bg-white z-10 border-r border-slate-100/50 flex flex-col items-center justify-center py-4 gap-1 transition-colors ${range.id ? 'cursor-pointer hover:bg-indigo-50/50 group' : ''}`}
                        title={range.id ? "Edit time slot" : ""}
                      >
                        <NotoEmoji code={range.icon} className={`w-5 h-5 mb-1 ${range.id ? 'group-hover:scale-110 transition-transform' : ''}`} />
                        <span className="text-[12px] font-bold text-slate-600">{formatTimeOnly(range.start)}</span>
                        <span className="text-[11px] font-medium text-slate-400">{formatTimeOnly(range.end)}</span>
                      </div>

                      {isBreakRow ? (
                        <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] mx-2 my-2 rounded-[20px] border border-slate-100 relative group">
                           <div className="flex flex-col items-center gap-1.5">
                              <div className="flex items-center gap-2">
                                <NotoEmoji code="2615" className="w-6 h-6" />
                                <span className="text-[13px] font-bold text-slate-700">Break Time</span>
                              </div>
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                Take a short break and refresh your mind <NotoEmoji code="2601" className="w-3.5 h-3.5" />
                              </span>
                           </div>
                           {breakBlock && (
                             <button onClick={() => handleDeleteBlock(breakBlock.id)} className="absolute right-4 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <X className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                      ) : (
                        DAYS.map((day, dIdx) => {
                          const block = blocksInRow.find(b => b.dayIndex === dIdx)
                          if (!block) {
                            return (
                              <div key={dIdx} className="flex-1 min-w-[110px] p-2 border-r border-slate-50/50 relative group">
                                <button onClick={() => setInlineSelector({ dayIndex: dIdx, start: range.start, end: range.end })} className="w-full h-full rounded-[16px] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:border-indigo-200">
                                  <Plus className="w-6 h-6 text-indigo-400" />
                                  <span className="text-[10px] font-bold text-indigo-400">Add Subject</span>
                                </button>
                              </div>
                            )
                          }
                          const { emoji, bg, text } = getSubjectProps(block.category)
                          const label = categories.find(c => c.id === block.category)?.label || 'Other'
                          return (
                            <div key={dIdx} className="flex-1 min-w-[110px] p-1.5 border-r border-slate-50/50 relative group">
                              <div className="w-full h-full rounded-[20px] p-3 flex flex-col items-center justify-center text-center gap-2.5 transition-all" style={{ backgroundColor: bg }}>
                                <div className="absolute top-2.5 right-2.5">
                                  <Sparkles className="w-3.5 h-3.5 opacity-40" style={{ color: text }} />
                                </div>
                                <span className="text-[12px] font-bold leading-tight mt-1" style={{ color: text }}>{label}</span>
                                <NotoEmoji code={emoji} className="w-8 h-8 drop-shadow-sm" />
                                <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] rounded-[20px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => handleDeleteBlock(block.id)} className="bg-white text-red-500 rounded-full p-2.5 shadow-lg transform scale-90 group-hover:scale-100 transition-all hover:bg-red-500 hover:text-white">
                                    <X className="w-5 h-5" strokeWidth={3} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {inlineSelector && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in p-6">
              <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 w-full max-w-sm relative animate-rise">
                <button onClick={() => setInlineSelector(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="font-display text-[18px] font-bold text-slate-800 mb-4">Select Subject for {DAYS[inlineSelector.dayIndex]} {inlineSelector.start}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {categories.filter(c => c.id !== 'other').map(c => {
                    const { emoji, bg, text } = getSubjectProps(c.id)
                    return (
                      <button key={c.id} onClick={() => handleSaveBlock({ ...inlineSelector, category: c.id })} className="flex flex-col items-center justify-center gap-2 p-3 rounded-[20px] transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: bg }}>
                        <NotoEmoji code={emoji} className="w-7 h-7" />
                        <span className="text-[10px] font-bold text-center leading-tight" style={{ color: text }}>{c.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Today Goal Banner */}
      <div className="fixed bottom-[110px] left-0 right-0 mx-auto w-full max-w-md px-4 z-30 pointer-events-none flex items-center">
         {/* Banner */}
         <div className="w-full bg-white rounded-[24px] shadow-[0_8px_24px_rgba(148,163,184,0.15)] border border-slate-100 p-3.5 flex items-center overflow-hidden animate-rise pointer-events-auto relative">
           {/* Target Icon */}
           <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-indigo-400">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="#E0E7FF"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                <path d="M12 12 L19 5 M17 5 h2 v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </div>
           
           <div className="ml-3 z-10 flex-shrink-0">
             <h3 className="text-[14px] font-bold text-slate-800 leading-tight">Today Goal</h3>
           </div>

           <div className="ml-auto mr-[120px] z-10 flex flex-col justify-center w-[75px]">
             <span className="text-[11px] font-bold text-indigo-500 text-right mb-1 whitespace-nowrap">{stats.done} / {stats.assigned} Tasks</span>
             <div className="w-full h-1.5 bg-indigo-50 rounded-full overflow-hidden shrink-0">
               <div className="h-full bg-[#8B7CF6] rounded-full transition-all duration-1000" style={{ width: `${stats.pct}%` }}></div>
             </div>
           </div>

           {/* Custom Scene from User */}
           <div className="absolute right-[-10px] bottom-[-2px] w-[130px] h-full pointer-events-none flex items-end justify-end overflow-visible">
              <img src="/daily-goal-bear.png" alt="Bear Reading" className="w-full h-[140%] object-contain origin-bottom-right drop-shadow-sm" />
           </div>
         </div>
      </div>

      <GridSlotModal 
        open={!!editingGridSlot} 
        slot={editingGridSlot} 
        onClose={() => setEditingGridSlot(null)} 
        onSave={handleSaveGridSlot} 
        onDelete={handleDeleteGridSlot} 
      />

      <TimeTableModal open={modalOpen} onClose={() => setModalOpen(false)} initial={null} dayIndex={activeDayForAdd} onSave={handleSaveBlock} />
    </div>
  )
}
