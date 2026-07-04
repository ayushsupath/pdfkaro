export default function ProgressBar({ progress, label = 'Processing...' }) {
  if (progress <= 0) return null

  const safeProgress = Math.min(progress, 100)
  const filled = Math.round(safeProgress / 10)
  const bar = `[${'|'.repeat(filled)}${'.'.repeat(10 - filled)}]`

  return (
    <div className="w-full border border-border bg-black/70 p-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-primary">
        <span>{label}</span>
        <span>{Math.round(safeProgress)}%</span>
      </div>
      <div className="mt-2 font-mono text-sm text-primary">{bar}</div>
    </div>
  )
}
