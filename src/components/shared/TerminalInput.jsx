import { forwardRef } from 'react'

const TerminalInput = forwardRef(function TerminalInput(
  { className = '', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border-2 border-black bg-ui px-4 py-3 text-sm font-medium text-ink outline-none placeholder:text-brand-charcoal/60 focus:border-black focus:ring-2 focus:ring-brand-yellow ${className}`.trim()}
      {...props}
    />
  )
})

export default TerminalInput
