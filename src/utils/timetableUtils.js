const TIMETABLE_KEY = 'upsc_timetable_v1'
const TIMETABLE_SLOTS_KEY = 'upsc_timetable_slots_v1'

const DEFAULT_SLOTS = [
  { id: 'slot-1', start: '06:00', end: '08:00', icon: '26c5' },
  { id: 'slot-2', start: '08:00', end: '10:00', icon: '1f4d6' },
  { id: 'slot-3', start: '10:30', end: '12:30', icon: '1f4dd' },
  { id: 'slot-4', start: '13:30', end: '15:30', icon: '1f33f' },
  { id: 'slot-5', start: '15:30', end: '16:00', icon: '2615', isBreak: true },
  { id: 'slot-6', start: '16:00', end: '18:00', icon: '1f304' },
  { id: 'slot-7', start: '19:00', end: '21:00', icon: '1f319' }
]

export function getGridSlots() {
  try {
    const data = localStorage.getItem(TIMETABLE_SLOTS_KEY)
    if (data) return JSON.parse(data)
  } catch (err) {
    console.error('Failed to parse slots', err)
  }
  return DEFAULT_SLOTS
}

export function saveGridSlots(slots) {
  localStorage.setItem(TIMETABLE_SLOTS_KEY, JSON.stringify(slots))
}

export function updateGridSlot(id, newStart, newEnd) {
  const slots = getGridSlots()
  const index = slots.findIndex(s => s.id === id)
  if (index !== -1) {
    slots[index].start = newStart
    slots[index].end = newEnd
    saveGridSlots(slots)
  }
  return slots
}

export function removeGridSlot(id) {
  const slots = getGridSlots()
  const filtered = slots.filter(s => s.id !== id)
  saveGridSlots(filtered)
  return filtered
}

export function addGridSlot(start, end, isBreak = false) {
  const slots = getGridSlots()
  const newSlot = {
    id: 'slot-' + Date.now(),
    start,
    end,
    icon: isBreak ? '2615' : '2728',
    isBreak
  }
  slots.push(newSlot)
  slots.sort((a, b) => a.start.localeCompare(b.start))
  saveGridSlots(slots)
  return slots
}

export function getTimetable() {
  try {
    const data = localStorage.getItem(TIMETABLE_KEY)
    if (data) return JSON.parse(data)
  } catch (err) {
    console.error('Failed to parse timetable', err)
  }
  return []
}

export function saveTimetable(timetable) {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable))
}

export function addTimetableBlock(block) {
  const current = getTimetable()
  const newBlock = { ...block, id: Date.now().toString() }
  const updated = [...current, newBlock]
  saveTimetable(updated)
  return updated
}

export function removeTimetableBlock(id) {
  const current = getTimetable()
  const updated = current.filter(b => b.id !== id)
  saveTimetable(updated)
  return updated
}

export function updateTimetableBlock(updatedBlock) {
  const current = getTimetable()
  const updated = current.map(b => b.id === updatedBlock.id ? updatedBlock : b)
  saveTimetable(updated)
  return updated
}
