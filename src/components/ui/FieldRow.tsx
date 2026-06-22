import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FieldProps {
  label: string
  value?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * A single label→value pair, the atomic unit of the detail screens.
 * Label is muted/small above a strong value, matching the Figma field style.
 */
export function Field({ label, value, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-base font-medium text-fg-strong">{children ?? value ?? '—'}</span>
    </div>
  )
}

/** Responsive two-column grid of Fields used inside SectionCards. */
export function FieldGrid({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode
  columns?: 1 | 2 | 3
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-x-12 gap-y-field-gap',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
