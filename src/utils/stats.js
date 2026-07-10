import { addDays, todayKey } from './dateUtils'

export function tasksForDate(tasks, dateKey) {
  return tasks.filter((t) => t.date === dateKey)
}

export function dayStats(tasks, dateKey) {
  const day = tasksForDate(tasks, dateKey)
  const assigned = day.length
  const done = day.filter((t) => t.completed).length
  const pct = assigned === 0 ? null : Math.round((done / assigned) * 100)
  return { assigned, done, pct, tasks: day }
}

export function rangeStats(tasks, dateKeys) {
  let assigned = 0
  let done = 0
  let studiedDays = 0
  let wastedDays = 0
  let plannedDays = 0
  const perDay = dateKeys.map((dk) => {
    const s = dayStats(tasks, dk)
    assigned += s.assigned
    done += s.done
    if (s.assigned > 0) {
      plannedDays += 1
      if (s.done > 0) studiedDays += 1
      else if (dk <= todayKey()) wastedDays += 1
    }
    return { date: dk, ...s }
  })
  const pct = assigned === 0 ? null : Math.round((done / assigned) * 100)
  return { assigned, done, pct, studiedDays, wastedDays, plannedDays, perDay }
}

export function currentStreak(tasks) {
  let streak = 0
  let cursor = todayKey()
  // if today has no completed tasks yet, start counting from yesterday
  const today = dayStats(tasks, cursor)
  if (today.done === 0) {
    cursor = addDays(cursor, -1)
  }
  for (let i = 0; i < 365; i++) {
    const s = dayStats(tasks, cursor)
    if (s.done > 0) {
      streak += 1
      cursor = addDays(cursor, -1)
    } else {
      break
    }
  }
  return streak
}

export function categoryBreakdown(tasks, dateKeys) {
  const set = new Set(dateKeys)
  const map = {}
  tasks
    .filter((t) => set.has(t.date))
    .forEach((t) => {
      const cat = t.category || 'other'
      if (!map[cat]) map[cat] = { assigned: 0, done: 0 }
      map[cat].assigned += 1
      if (t.completed) map[cat].done += 1
    })
  return map
}

export function ratingFromPct(pct) {
  if (pct === null) return null
  return Math.round((pct / 100) * 10 * 10) / 10
}
