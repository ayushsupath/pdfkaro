import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import ToolCard from '../components/shared/ToolCard'
import { TOOLS, TRUST_BADGES } from '../utils/constants'

export default function Home() {
  const [displayTitle, setDisplayTitle] = useState('')

  useEffect(() => {
    let current = 0
    const fullText = 'PDFKARO'
    const timer = window.setInterval(() => {
      current += 1
      setDisplayTitle(fullText.slice(0, current))
      if (current >= fullText.length) window.clearInterval(timer)
    }, 70)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(51,255,0,0.04) 0, rgba(51,255,0,0.04) 1px, transparent 1px, transparent 8px)' }} />
        <div className="relative mx-auto max-w-4xl border border-border bg-black/80 p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">[status] local-only toolkit</p>
          <h1 className="mt-4 text-4xl font-semibold uppercase tracking-[0.25em] text-primary text-glow sm:text-6xl">
            {displayTitle}
            <span className="cursor-blink">_</span>
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-primary/80 sm:text-base">
            free. private. no login. just kaam ho jaye.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary/70">
            All PDF tools run entirely in your browser. Your files are never uploaded to any server.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {TRUST_BADGES.map((badge) => (
              <span key={badge.text} className="border border-border bg-black/80 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-primary">
                {badge.icon} {badge.text}
              </span>
            ))}
          </div>

          <Link
            to="/sign-pdf"
            className="mt-8 inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-background transition-colors hover:bg-primary/90"
          >
            <PenLine className="h-4 w-4" />
            sign a pdf -- flagship tool
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 border border-border bg-black/70 p-4">
          <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-primary text-glow">
            all pdf tools<span className="cursor-blink">_</span>
          </h2>
          <p className="mt-2 text-sm text-primary/70">
            pick a tool — everything processes locally on your device
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  )
}
