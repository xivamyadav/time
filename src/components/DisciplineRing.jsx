export default function DisciplineRing({ pct, size = 168, label, sub }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const value = pct ?? 0
  const offset = circumference - (value / 100) * circumference

  const color = value >= 80 ? '#10B981' : value >= 50 ? '#4F46E5' : '#F87171'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            '--ring-start': circumference,
            '--ring-end': offset,
          }}
          className="animate-ring"
        />
      </svg>
      <div className="absolute flex flex-col items-center px-2 text-center">
        <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums leading-none">
          {pct === null ? '—' : `${value}%`}
        </span>
        {label && size > 120 && <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>}
        {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
      </div>
    </div>
  )
}
