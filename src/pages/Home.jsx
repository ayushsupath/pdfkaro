import { Link } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import ToolCard from '../components/shared/ToolCard'
import { TOOLS, TRUST_BADGES } from '../utils/constants'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            PDFKaro
          </h1>
          <p className="mt-3 text-lg text-primary-100 sm:text-xl">
            Free. Private. No Login. Just Kaam Ho Jaye.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-200 sm:text-base">
            All PDF tools run entirely in your browser. Your files are never uploaded to any server.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge.text}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                {badge.icon} {badge.text}
              </span>
            ))}
          </div>

          <Link
            to="/sign-pdf"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition-all hover:bg-accent-600 hover:shadow-xl"
          >
            <PenLine className="h-5 w-5" />
            Sign a PDF — Our Flagship Tool
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All PDF Tools</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Pick a tool — everything processes locally on your device
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  )
}
