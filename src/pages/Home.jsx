import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ToolCard from '../components/shared/ToolCard'
import { TOOLS, TRUST_BADGES } from '../utils/constants'

export default function Home() {
  const [displayTitle, setDisplayTitle] = useState('')
  const location = useLocation()

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

  useEffect(() => {
    if (location.hash === '#tools') {
      setTimeout(() => {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location])

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden bg-brand-yellow neo-dot-grid border-y-2 border-black px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border-2 border-black bg-ui px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-ink shadow-hard-sm">
              100% FREE · NO LOGIN · PRIVATE
            </div>
            <h1 className="text-5xl font-heading font-extrabold uppercase tracking-[-0.04em] text-ink sm:text-6xl">
              browser-first PDF tools for <span className="text-transparent stroke-black text-[inherit]" style={{ WebkitTextStroke: '2px #000000' }}>PRIVATE</span> workflows.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-brand-charcoal/90">
              Convert, merge, split, sign, and export PDFs entirely in your browser — no server, no login, no tracking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/#tools"
                className="rounded-md border-2 border-black bg-ink px-6 py-4 text-sm font-heading font-bold uppercase tracking-[0.25em] text-ui shadow-hard-lg transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm"
              >
                Browse Tools
              </Link>
              <a
                href="#how-it-works"
                className="rounded-md border-2 border-black bg-ui px-6 py-4 text-sm font-heading font-bold uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
              >
                How It Works
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border-2 border-black bg-ui p-6 shadow-hard-xl">
            <div className="rounded-3xl border-2 border-black bg-brand-yellow p-4">
              <div className="flex h-12 items-center gap-2 rounded-xl bg-black px-4">
                <span className="h-3 w-3 rounded-full bg-[#ff3b30]" />
                <span className="h-3 w-3 rounded-full bg-[#ffcc00]" />
                <span className="h-3 w-3 rounded-full bg-[#34c84a]" />
              </div>
              <div className="mt-4 space-y-4 rounded-3xl border-2 border-black bg-ui p-6">
                <div className="h-48 rounded-2xl border-2 border-black bg-brand-charcoal" />
                <div className="space-y-3">
                  <div className="h-4 w-2/3 rounded-sm bg-brand-yellow" />
                  <div className="h-4 w-1/2 rounded-sm bg-brand-sage" />
                  <div className="h-4 w-5/6 rounded-sm bg-brand-charcoal" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-yellow border-y-2 border-black px-4 py-10 sm:px-6" id="tools">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-heading font-semibold uppercase tracking-[0.3em] text-brand-charcoal">All tools</p>
              <p className="mt-2 max-w-2xl text-base leading-7 text-brand-charcoal/90">Pick a tool and process your files locally in the browser. No account or upload required.</p>
            </div>
            <div className="rounded-md border-2 border-black bg-ui px-4 py-3 text-sm font-bold uppercase tracking-[0.25em] text-ink shadow-hard-sm">
              Private, local, browser-first
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal border-t-2 border-black px-4 py-10 sm:px-6" id="how-it-works">
        <div className="mx-auto max-w-6xl space-y-6 rounded-3xl border-2 border-black bg-ui p-8 shadow-hard-lg">
          <p className="text-xs font-heading uppercase tracking-[0.35em] text-brand-charcoal/80">How it works</p>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Upload', description: 'Drop your file into the browser.' },
              { title: 'Process', description: 'Conversion happens locally on your device.' },
              { title: 'Download', description: 'Save the output immediately and privately.' },
            ].map((step) => (
              <div key={step.title} className="space-y-3 rounded-2xl border-2 border-black p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-brand-yellow text-ink text-lg font-bold">
                  {step.title[0]}
                </div>
                <p className="text-sm font-heading uppercase tracking-[0.2em] text-brand-charcoal">{step.title}</p>
                <p className="text-sm leading-6 text-brand-charcoal/80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
