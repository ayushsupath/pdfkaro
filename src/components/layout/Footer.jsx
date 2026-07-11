import { Link } from 'react-router-dom'
import { Mail, Shield, Zap, UserX } from 'lucide-react'

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-brand-charcoal py-12 px-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col rounded-xl border-2 border-black bg-brand-yellow p-6 shadow-hard-sm text-ink transition-transform hover:-translate-y-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2 border-black bg-ink text-xs font-bold uppercase text-brand-yellow">
              P
            </div>
            <div>
              <p className="text-sm font-heading font-bold uppercase tracking-[0.3em] text-ink">PDFKARO</p>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed text-brand-charcoal">
            Free, private, browser-based PDF tools.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col rounded-xl border-2 border-black bg-ui p-6 shadow-hard-sm text-ink transition-transform hover:-translate-y-1">
          <p className="mb-5 text-sm font-heading font-bold uppercase tracking-[0.3em]">Quick Links</p>
          <ul className="space-y-3 font-medium text-brand-charcoal">
            <li>
              <Link to="/" className="inline-block transition-transform hover:translate-x-1 hover:text-ink">
                Home
              </Link>
            </li>
            <li>
              <Link to="/#tools" className="inline-block transition-transform hover:translate-x-1 hover:text-ink">
                Choose a Tool
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="inline-block transition-transform hover:translate-x-1 hover:text-ink">
                How it Works
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="flex flex-col rounded-xl border-2 border-black bg-brand-sage p-6 shadow-hard-sm text-ink transition-transform hover:-translate-y-1">
          <p className="mb-5 text-sm font-heading font-bold uppercase tracking-[0.3em]">Contact</p>
          <div className="space-y-4">
            <a 
              href="mailto:ayushsupath1829@gmail.com"
              className="flex items-center gap-3 font-medium text-brand-charcoal transition-transform hover:translate-x-1 hover:text-ink"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-black bg-ui">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-sm break-all">ayushsupath1829@gmail.com</span>
            </a>
            <a 
              href="https://github.com/ayushsupath/pdfkaro"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 font-medium text-brand-charcoal transition-transform hover:translate-x-1 hover:text-ink"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-black bg-ui">
                <GithubIcon className="h-4 w-4" />
              </div>
              <span className="text-sm">GitHub Repo</span>
            </a>
          </div>
        </div>

        {/* Column 4: Trust */}
        <div className="flex flex-col rounded-xl border-2 border-black bg-ui p-6 shadow-hard-sm text-ink transition-transform hover:-translate-y-1">
          <p className="mb-5 text-sm font-heading font-bold uppercase tracking-[0.3em]">Trust</p>
          <ul className="space-y-4 font-medium text-brand-charcoal">
            <li className="flex items-center gap-3">
              <UserX className="h-4 w-4 text-ink" />
              <span className="text-sm uppercase tracking-widest text-xs font-bold">No Login</span>
            </li>
            <li className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-ink" />
              <span className="text-sm uppercase tracking-widest text-xs font-bold">No Uploads</span>
            </li>
            <li className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-ink" />
              <span className="text-sm uppercase tracking-widest text-xs font-bold">100% Free</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
