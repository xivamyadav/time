const KEY = 'mission-tracker:tasks:v1'
const META_KEY = 'mission-tracker:meta:v1'

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks))
  } catch (e) {
    console.error('Could not save tasks', e)
  }
}

export function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY)
    return raw ? JSON.parse(raw) : { categories: null }
  } catch {
    return { categories: null }
  }
}

export function saveMeta(meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch (e) {
    console.error('Could not save meta', e)
  }
}

export function exportData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: loadTasks(),
    meta: loadMeta(),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `mission-tracker-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
          throw new Error('Invalid backup file')
        }
        saveTasks(parsed.tasks)
        if (parsed.meta) saveMeta(parsed.meta)
        resolve(parsed.tasks)
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}
