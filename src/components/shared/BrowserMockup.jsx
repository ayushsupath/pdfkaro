export default function BrowserMockup({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border-2 border-black bg-ui shadow-hard-xl ${className}`.trim()}>
      <div className="flex items-center gap-2 border-b-2 border-black bg-ink px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff3b30]" />
        <span className="h-3 w-3 rounded-full bg-[#ffcc00]" />
        <span className="h-3 w-3 rounded-full bg-[#34c84a]" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
