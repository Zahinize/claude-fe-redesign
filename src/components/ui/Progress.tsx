import { cn } from '@/lib/cn'

type ProgressTone = 'success' | 'warning' | 'danger' | 'brand'

/** Pick a tone by threshold (green ≥70, amber ≥40, red below) — matches the asset. */
export function scoreTone(value: number): ProgressTone {
  if (value >= 70) return 'success'
  if (value >= 40) return 'warning'
  return 'danger'
}

const barColor: Record<ProgressTone, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  brand: 'bg-brand-600',
}
const trackColor: Record<ProgressTone, string> = {
  success: 'bg-success-50',
  warning: 'bg-warning-50',
  danger: 'bg-danger-50',
  brand: 'bg-brand-50',
}
const ringStroke: Record<ProgressTone, string> = {
  success: 'stroke-success-500',
  warning: 'stroke-warning-500',
  danger: 'stroke-danger-500',
  brand: 'stroke-brand-600',
}
const ringTrack: Record<ProgressTone, string> = {
  success: 'stroke-success-50',
  warning: 'stroke-warning-50',
  danger: 'stroke-danger-50',
  brand: 'stroke-brand-50',
}

export function ProgressBar({
  value,
  max = 100,
  tone,
  className,
}: {
  value: number
  max?: number
  tone?: ProgressTone
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const t = tone ?? scoreTone(pct)
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-pill', trackColor[t], className)}>
      <div className={cn('h-full rounded-pill transition-all', barColor[t])} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function ProgressRing({
  value,
  max = 100,
  size = 72,
  tone,
}: {
  value: number
  max?: number
  size?: number
  tone?: ProgressTone
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const t = tone ?? scoreTone(pct)
  const stroke = 7
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={ringTrack[t]} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          className={cn('transition-all', ringStroke[t])}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-base font-semibold text-fg-strong">{Math.round(value)}</span>
        <span className="text-2xs text-fg-subtle">/{max}</span>
      </div>
    </div>
  )
}
