import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const location = useLocation()

  const handleChooseTool = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 h-20 border-b-2 border-black bg-brand-yellow">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-black bg-ink text-[10px] font-bold uppercase text-brand-yellow">
            P
          </div>
          <div>
            <p className="text-xs font-heading font-bold uppercase tracking-[0.35em] text-ink">PDFKARO</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-charcoal">no login · private · local</p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] text-brand-charcoal sm:flex">
          <Link
            to="/"
            className={`transition-colors ${
              location.pathname === '/' ? 'text-ink' : 'text-brand-charcoal hover:text-ink'
            }`}
          >
            Home
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/#tools"
            onClick={handleChooseTool}
            className="rounded-md border-2 border-black bg-ink px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-ui shadow-hard-lg transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm cursor-pointer"
          >
            Choose a Tool
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
