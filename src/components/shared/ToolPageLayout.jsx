import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ToolPageLayout({ title, description, children }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 border border-border bg-black/70 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:border-primary hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        --back
      </Link>

      <div className="mb-8 border border-border bg-black/80 p-4 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">[terminal]</p>
        <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.2em] text-primary text-glow sm:text-3xl">
          {title}
          <span className="cursor-blink">_</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-primary/80">{description}</p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-muted">
          [OK] processed locally — files never leave your device
        </p>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  )
}
