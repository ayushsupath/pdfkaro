import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/', label: '--home' },
  { to: '/sign-pdf', label: '--sign' },
  { to: '/merge-pdf', label: '--merge' },
  { to: '/split-pdf', label: '--split' },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="border border-border bg-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.35em] text-primary">
            <span className="text-glow">+--- PDFKARO ---+</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">free / local / private</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`border px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  isActive ? 'border-primary bg-primary text-background' : 'border-border text-primary hover:border-primary hover:bg-primary/10'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
