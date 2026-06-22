import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useOnClickOutside } from '@/lib/useOnClickOutside'

interface PopoverProps {
  /** Render prop for the trigger; receives open state + toggle. */
  trigger: (args: { open: boolean; toggle: () => void; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  children: (args: { close: () => void }) => ReactNode
  align?: 'start' | 'end'
  /** Open below (default) or above the trigger — use 'top' near the viewport bottom. */
  side?: 'bottom' | 'top'
  className?: string
  panelClassName?: string
}

/**
 * Lightweight anchored popover (click-outside + Escape). Hand-built, no Radix.
 * Positioned with CSS relative to the trigger wrapper.
 */
export function Popover({ trigger, children, align = 'start', side = 'bottom', className, panelClassName }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useOnClickOutside(containerRef, () => setOpen(false), open)

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {trigger({ open, toggle: () => setOpen((o) => !o), ref: triggerRef })}
      {open && (
        <div
          className={cn(
            'absolute z-30 min-w-[12rem] animate-scale-in rounded-control border border-border bg-surface p-1 shadow-dropdown',
            side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            align === 'end' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  )
}

export function MenuItem({
  icon: Icon,
  children,
  onClick,
  tone = 'default',
}: {
  icon?: LucideIcon
  children: ReactNode
  onClick?: () => void
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-chip px-2.5 py-2 text-left text-base transition-colors',
        tone === 'danger'
          ? 'text-danger-600 hover:bg-danger-50'
          : 'text-fg hover:bg-surface-sunken',
      )}
    >
      {Icon && <Icon size={16} className="shrink-0" />}
      {children}
    </button>
  )
}
