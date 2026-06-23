import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: Crumb[]
  /** Optional leading icon (e.g. the section's shield). */
  icon?: LucideIcon
  className?: string
}

/** Breadcrumb trail, e.g. "Governance / Data Classification". */
export function Breadcrumb({ items, icon: Icon, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
      {Icon && <Icon size={16} className="text-brand-600" />}
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={item.label}>
            {item.to && !last ? (
              <Link to={item.to} className="font-medium text-fg-muted transition-colors hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span className={cn('font-medium', last ? 'text-fg-strong' : 'text-fg-muted')}>
                {item.label}
              </span>
            )}
            {!last && <ChevronRight size={15} className="text-fg-subtle" />}
          </Fragment>
        )
      })}
    </nav>
  )
}
