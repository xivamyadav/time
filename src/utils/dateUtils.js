// All dates are stored/compared as local YYYY-MM-DD strings to avoid timezone drift.

export function toKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey() {
  return toKey(new Date())
}

export function addDays(dateKey, n) {
  const d = new Date(dateKey + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export function startOfWeek(dateKey) {
  const d = new Date(dateKey + 'T00:00:00')
  const day = d.getDay() // 0 = Sunday
  d.setDate(d.getDate() - day)
  return toKey(d)
}

export function weekDates(dateKey) {
  const start = startOfWeek(dateKey)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function startOfMonth(dateKey) {
  const d = new Date(dateKey + 'T00:00:00')
  return toKey(new Date(d.getFullYear(), d.getMonth(), 1))
}

export function monthGrid(dateKey) {
  const d = new Date(dateKey + 'T00:00:00')
  const year = d.getFullYear()
  const month = d.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let day = 1; day <= totalDays; day++) {
    cells.push(toKey(new Date(year, month, day)))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function formatLabel(dateKey, opts = {}) {
  const d = new Date(dateKey + 'T00:00:00')
  return d.toLocaleDateString('en-IN', {
    weekday: opts.weekday || 'short',
    day: 'numeric',
    month: opts.month || 'short',
    ...opts,
  })
}

export function monthLabel(dateKey) {
  const d = new Date(dateKey + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function isSameDay(a, b) {
  return a === b
}

export function isFuture(dateKey) {
  return dateKey > todayKey()
}
