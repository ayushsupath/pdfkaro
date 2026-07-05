import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="group block overflow-hidden rounded-3xl border-2 border-black bg-ui shadow-hard-sm transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand-sage text-xs font-bold uppercase text-ink transition-colors duration-200 group-hover:bg-brand-yellow">
            {tool.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}
          </div>
          <p className="text-base font-heading font-semibold uppercase tracking-[-0.02em] text-ink">
            {tool.name}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-brand-charcoal/70">{tool.featured ? 'flagship' : 'tool'}</span>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed tracking-[0.01em] text-brand-charcoal/75">{tool.description}</p>
      </div>
    </Link>
  )
}
