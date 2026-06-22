import { cn } from '@/lib/cn'

export interface TimelineField {
  label: string
  value: string
  /** Dim muted entries like "Not Withdrawn". */
  muted?: boolean
}

/**
 * Vertical label→value timeline used by the Lifecycle tab
 * (assets/features/consent-management-lifecycle-5.png).
 */
export function FieldTimeline({ items }: { items: TimelineField[] }) {
  return (
    <ol className="relative">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <li key={item.label} className="relative flex gap-4 pb-6 last:pb-0">
            {/* dot + connector */}
            <div className="relative flex flex-col items-center">
              <span className="z-10 mt-1 h-2.5 w-2.5 rounded-full bg-neutral-300 ring-4 ring-surface" />
              {!last && <span className="absolute top-1 h-full w-px bg-border" />}
            </div>
            <div className="flex flex-col gap-1 pb-1">
              <span className="text-sm text-fg-muted">{item.label}</span>
              <span
                className={cn(
                  'text-base font-medium',
                  item.muted ? 'text-fg-subtle' : 'text-fg-strong',
                )}
              >
                {item.value}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
