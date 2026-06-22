import { cn } from '@/lib/cn'

interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  /** Accessible label when there's no visible text association. */
  label?: string
  size?: 'sm' | 'md'
}

/**
 * Blue pill switch (assets/components/component-tabs-&-radio-group.png / scope tab).
 * Hand-built (no Radix) per the forbidden-library rule.
 */
export function Toggle({ checked, onChange, disabled = false, label, size = 'md' }: ToggleProps) {
  const dims =
    size === 'sm'
      ? { track: 'h-5 w-9', thumb: 'h-4 w-4', on: 'translate-x-4' }
      : { track: 'h-6 w-11', thumb: 'h-5 w-5', on: 'translate-x-5' }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-pill p-0.5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
        dims.track,
        checked ? 'bg-brand-600' : 'bg-neutral-300',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className={cn(
          'inline-block transform rounded-full bg-white shadow-toggle transition-transform',
          dims.thumb,
          checked ? dims.on : 'translate-x-0',
        )}
      />
    </button>
  )
}
