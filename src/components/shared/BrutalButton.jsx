import { forwardRef } from 'react'

const variants = {
  primary: 'bg-ink text-ui border-black shadow-hard-lg hover:shadow-hard-sm hover:-translate-x-[4px] hover:-translate-y-[4px]',
  secondary: 'bg-ui text-ink border-black shadow-hard-lg hover:shadow-hard-sm hover:-translate-x-[4px] hover:-translate-y-[4px]',
  ghost: 'bg-transparent text-ui border-black shadow-hard-sm hover:shadow-hard-none hover:-translate-x-[4px] hover:-translate-y-[4px]',
}

const BrutalButton = forwardRef(function BrutalButton(
  { children, className = '', variant = 'primary', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md border-2 px-5 py-3 text-xs font-medium uppercase tracking-[0.25em] transition-transform duration-200 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
})

export default BrutalButton
