import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white shadow-md shadow-primary-600/30 transition-transform group-hover:scale-105">
            PK
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">PDFKaro</span>
            <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
              Free. Private. No Login.
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {location.pathname !== '/sign-pdf' && (
            <Link
              to="/sign-pdf"
              className="hidden rounded-lg bg-accent-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-600 sm:inline-flex"
            >
              Sign PDF
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
