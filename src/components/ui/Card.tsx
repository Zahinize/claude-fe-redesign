import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps {
  className?: string
  children: ReactNode
}

/** Base white surface used everywhere. */
export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-card border border-border bg-surface shadow-card', className)}>
      {children}
    </div>
  )
}

interface SectionCardProps {
  title: string
  /** Optional right-aligned header content (actions, counts). */
  action?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

/**
 * Card with a titled header band + divider, matching the consent detail sections
 * ("Subject Information", "Consent Details", "Capture Evidence", "Lifecycle", ...).
 */
export function SectionCard({
  title,
  action,
  className,
  bodyClassName,
  children,
}: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex h-12 items-center justify-between border-b border-border bg-surface-sunken/60 px-card">
        <h3 className="text-base font-semibold text-fg-strong">{title}</h3>
        {action}
      </div>
      <div className={cn('p-card', bodyClassName)}>{children}</div>
    </Card>
  )
}
