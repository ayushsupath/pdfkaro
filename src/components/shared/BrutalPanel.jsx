import { forwardRef } from 'react'

const shadows = {
  sm: 'shadow-hard-sm',
  lg: 'shadow-hard-lg',
  xl: 'shadow-hard-xl',
}

const BrutalPanel = forwardRef(function BrutalPanel(
  { title, children, className = '', shadow = 'sm', titleClassName = '', bodyClassName = '' },
  ref
) {
  return (
    <section
      ref={ref}
      className={`rounded-xl border-2 border-black bg-ui text-ink ${shadows[shadow]} ${className}`.trim()}
    >
      {title ? (
        <div className={`border-b-2 border-black px-4 py-3 ${titleClassName}`.trim()}>
          <p className="text-xs uppercase tracking-[0.3em]">{title}</p>
        </div>
      ) : null}
      <div className={`p-4 ${bodyClassName}`.trim()}>{children}</div>
    </section>
  )
})

export default BrutalPanel
