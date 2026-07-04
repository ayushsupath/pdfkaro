import { forwardRef } from 'react'

const Panel = forwardRef(function Panel(
  { title, children, className = '', bodyClassName = '', titleClassName = '', inset = false },
  ref
) {
  return (
    <section
      ref={ref}
      className={`border border-border bg-background/95 text-primary shadow-[0_0_0_1px_rgba(31,82,31,0.2)] ${className}`.trim()}
    >
      {title ? (
        <div className={`border-b border-border bg-black/40 px-3 py-2 ${titleClassName}`.trim()}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-primary">{title}</p>
        </div>
      ) : null}
      <div className={`${inset ? 'p-3 sm:p-4' : 'p-4 sm:p-6'} ${bodyClassName}`.trim()}>{children}</div>
    </section>
  )
})

export default Panel
