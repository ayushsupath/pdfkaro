export default function ProgressBar({ progress, label = 'Processing...' }) {
  if (progress <= 0) return null

  const safeProgress = Math.min(progress, 100)

  return (
    <div className="w-full rounded-sm border-2 border-black bg-ui p-3 shadow-hard-sm">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] font-medium text-ink">
        <span>{label}</span>
        <span>{Math.round(safeProgress)}%</span>
      </div>
      <div className="mt-3 h-5 overflow-hidden rounded-sm border-2 border-black bg-brand-charcoal">
        <div className="h-full bg-brand-yellow" style={{ width: `${safeProgress}%` }} />
      </div>
    </div>
  )
}
