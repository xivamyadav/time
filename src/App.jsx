import { useEffect, useState, useCallback } from 'react'
import BottomNav from './components/BottomNav'
import TodayView from './components/TodayView'
import WeekView from './components/WeekView'
import MonthView from './components/MonthView'
import StatsView from './components/StatsView'
import TimeTableView from './components/TimeTableView'
import TaskModal from './components/TaskModal'
import { loadTasks, saveTasks } from './utils/storage'
import { todayKey } from './utils/dateUtils'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [activeTab, setActiveTab] = useState('today')
  const [dateKey, setDateKey] = useState(todayKey())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const reload = useCallback(() => setTasks(loadTasks()), [])

  function openAdd() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function handleSave(data) {
    if (data.id) {
      setTasks((prev) => prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)))
    } else {
      setTasks((prev) => [...prev, { ...data, id: uid(), createdAt: Date.now() }])
    }
  }

  function handleToggle(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleForward(id, nextDate) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, forwardedTo: nextDate } : t)))
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50">
      {activeTab === 'today' && (
        <TodayView
          tasks={tasks}
          dateKey={dateKey}
          setDateKey={setDateKey}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={handleDelete}
          onForward={handleForward}
          onAdd={openAdd}
        />
      )}
      {activeTab === 'week' && (
        <WeekView tasks={tasks} dateKey={dateKey} setDateKey={setDateKey} goToday={() => setDateKey(todayKey())} />
      )}
      {activeTab === 'month' && (
        <MonthView tasks={tasks} dateKey={dateKey} setDateKey={setDateKey} setActiveTab={setActiveTab} />
      )}
      {activeTab === 'timetable' && <TimeTableView onBack={() => setActiveTab('today')} />}
      {activeTab === 'stats' && <StatsView tasks={tasks} reload={reload} />}

      {activeTab !== 'timetable' && <BottomNav active={activeTab} onChange={setActiveTab} />}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingTask}
        dateKey={dateKey}
      />
    </div>
  )
}
