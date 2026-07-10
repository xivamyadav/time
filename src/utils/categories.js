import { loadMeta, saveMeta } from './storage'

export const DEFAULT_CATEGORIES = [
  { id: 'polity', label: 'Polity', color: '#F8F1F9' },
  { id: 'history', label: 'History', color: '#FFF0F5' },
  { id: 'geography', label: 'Geography', color: '#F0FAFF' },
  { id: 'economy', label: 'Economy', color: '#FEFAED' },
  { id: 'gs1', label: 'GS-I', color: '#FFF0F5' },
  { id: 'gs2', label: 'GS-II', color: '#F8F1F9' },
  { id: 'gs3', label: 'GS-III', color: '#F0FAFF' },
  { id: 'gs4', label: 'GS-IV (Ethics)', color: '#FEFAED' },
  { id: 'optional', label: 'Optional Subject', color: '#F4F6F8' },
  { id: 'essay', label: 'Essay Practice', color: '#F8F9FA' },
  { id: 'csat', label: 'CSAT Practice', color: '#F5F5FA' },
  { id: 'current', label: 'Current Affairs', color: '#F4FAF8' },
  { id: 'answer', label: 'Answer Writing', color: '#EDFDF9' },
  { id: 'map', label: 'Map Practice', color: '#FFF0F5' },
  { id: 'revision', label: 'Revision', color: '#FFF5F7' },
  { id: 'test', label: 'Test / Mock', color: '#FFF7F0' },
  { id: 'break', label: 'Break Time', color: '#F8F9FC' },
  { id: 'other', label: 'Custom Subject', color: '#F4F6F8' }
]

export function getCategories() {
  const meta = loadMeta()
  const custom = meta.categories || []
  const withoutOther = DEFAULT_CATEGORIES.filter(c => c.id !== 'other')
  const other = DEFAULT_CATEGORIES.find(c => c.id === 'other')
  return [...withoutOther, ...custom, other]
}

export function categoryById(id) {
  const all = getCategories()
  return all.find((c) => c.id === id) || all.find(c => c.id === 'other')
}

export function addCustomCategory(label) {
  const meta = loadMeta()
  const custom = meta.categories || []
  const id = 'custom_' + Date.now().toString(36)
  
  const colors = ['#8B7CF6', '#F0654F', '#E8B04B', '#3ECF8E', '#4FC3F0', '#F0507A', '#F5D142', '#5EEAD4']
  const color = colors[custom.length % colors.length]
  
  const newCat = { id, label, color }
  meta.categories = [...custom, newCat]
  saveMeta(meta)
  return newCat
}
