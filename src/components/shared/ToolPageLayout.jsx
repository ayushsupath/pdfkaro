import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ToolPageLayout({ title, description, children }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-md border-2 border-black bg-ui px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
      >
        <ArrowLeft className="h-4 w-4" />
        back to tools
      </Link>

      <div className="mb-8 rounded-3xl border-2 border-black bg-ui p-6 shadow-hard-lg">
        <p className="text-[10px] uppercase tracking-[0.35em] text-brand-charcoal">[terminal]</p>
        <h1 className="mt-2 text-3xl font-heading font-extrabold uppercase tracking-[-0.03em] text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/90">{description}</p>
        <div className="mt-4 h-px bg-black" />
        <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-brand-charcoal/70">
          [OK] processed locally — files never leave your device
        </p>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  )
}
