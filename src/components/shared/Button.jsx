import { forwardRef } from 'react'

const variants = {
  primary: 'border-primary text-primary hover:bg-primary hover:text-background',
  secondary: 'border-secondary text-secondary hover:bg-secondary hover:text-background',
  ghost: 'border-border text-primary hover:bg-primary/10 hover:text-primary',
  danger: 'border-error text-error hover:bg-error hover:text-background',
}

const Button = forwardRef(function Button(
  { children, className = '', variant = 'primary', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
