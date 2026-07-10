import { categoryById } from '../utils/categories'

export default function TaskItem({ task, onToggle, onEdit, onDelete, onForward, isForwarded }) {
  const cat = categoryById(task.category)

  return (
    <div className="group flex items-center gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 relative overflow-hidden">
      {isForwarded && (
        <div className="absolute top-0 left-0 h-full w-1 bg-indigo-500 rounded-l-[20px]"></div>
      )}
      <button
        onClick={onToggle}
        className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[2.5px] transition-all active:scale-90 ${
          task.completed
            ? 'border-mint-500 bg-mint-500 text-white shadow-sm'
            : 'border-slate-300 text-transparent hover:border-amber-500 hover:bg-amber-50'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L6.5 11.5L13 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex-1 overflow-hidden cursor-pointer" onClick={onEdit}>
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`truncate text-[15px] font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {task.title}
          </p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
          >
            {cat.label}
          </span>
          {isForwarded && (
            <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100">
              Forwarded
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v5l3 3M14 8A6 6 0 112 8a6 6 0 0112 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-mono">{task.start} – {task.end}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        {!task.completed && (
          <button title="Forward to next day" onClick={onForward} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        )}
        <button title="Delete task" onClick={onDelete} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-coral-50 hover:text-coral-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  )
}
