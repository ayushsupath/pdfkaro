import { forwardRef } from 'react'

const TerminalInput = forwardRef(function TerminalInput(
  { className = '', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full border border-border bg-black/80 px-3 py-3 text-sm font-medium text-primary outline-none placeholder:text-muted focus:border-primary focus:shadow-[0_0_0_1px_rgba(51,255,0,0.25)] ${className}`.trim()}
      {...props}
    />
  )
})

export default TerminalInput
