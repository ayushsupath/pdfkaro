import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className={`group block border border-border bg-black/70 text-primary transition-all duration-150 hover:border-primary hover:bg-primary hover:text-background ${
        tool.featured ? 'border-primary/70' : ''
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="text-[10px] uppercase tracking-[0.3em]">{tool.name.toUpperCase()}</p>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted group-hover:text-background/80">
          {tool.featured ? '[OK]' : '--'}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted group-hover:text-background/80">
          {`--${tool.id.replace(/-/g, ' ')}`}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-primary/80 group-hover:text-background">
          {tool.description}
        </p>
      </div>
    </Link>
  )
}
