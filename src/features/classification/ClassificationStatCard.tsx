import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LevelMeta } from './classificationMeta'

interface StatCardProps {
  title: string
  count: number
  total: number
  meta: LevelMeta
  icon: LucideIcon
}

/**
 * KPI summary card: a tinted icon chip + label, a large count with context,
 * a percentage, and a level-colored progress bar. Token-driven, no raw color.
 */
export function ClassificationStatCard({ title, count, total, meta, icon: Icon }: StatCardProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex flex-col gap-3.5 rounded-card border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-dropdown">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-control', meta.soft)}>
            <Icon size={18} className={meta.text} />
          </span>
          <span className="truncate text-sm font-medium text-fg-muted">{title}</span>
        </div>
        <span className={cn('shrink-0 text-sm font-semibold tnum', meta.text)}>{pct}%</span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold leading-none text-fg-strong tnum">{count}</span>
        <span className="text-sm text-fg-muted tnum">of {total}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-pill bg-neutral-100">
        <div className={cn('h-full rounded-pill transition-all', meta.bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
