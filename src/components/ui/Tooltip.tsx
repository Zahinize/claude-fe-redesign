import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom'
  children: ReactNode
  className?: string
}

/** Dark bubble tooltip (assets/components/component-tooltip.png). CSS hover, no Radix. */
export function Tooltip({ content, side = 'right', children, className }: TooltipProps) {
  const [open, setOpen] = useState(false)

  const position =
    side === 'right'
      ? 'left-full top-1/2 ml-2 -translate-y-1/2'
      : side === 'bottom'
        ? 'top-full left-1/2 mt-2 -translate-x-1/2'
        : 'bottom-full left-1/2 mb-2 -translate-x-1/2'

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 animate-fade-in whitespace-nowrap rounded-control bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-dropdown',
            position,
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
