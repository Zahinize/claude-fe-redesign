import { cn } from '@/lib/cn'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Pill segmented control (assets/components/component-tabs-&-radio-group.png "No/Yes"). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex rounded-control bg-surface-sunken p-0.5', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-chip px-3.5 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-primary text-primary-fg shadow-sm' : 'text-fg-muted hover:text-fg',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
