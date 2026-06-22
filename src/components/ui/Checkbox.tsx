import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CheckboxProps {
  checked: boolean
  onChange?: (next: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

const boxBase =
  'flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-chip border transition-colors'

/**
 * Blue checkbox (assets/components/component-checkbox-&-radio-button.png).
 * Renders as a presentational <span> when no `onChange` is given (e.g. inside a
 * clickable row) to avoid nesting interactive elements.
 */
export function Checkbox({ checked, onChange, disabled, label, className }: CheckboxProps) {
  const classes = cn(
    boxBase,
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
    checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-border bg-surface',
    disabled && 'cursor-not-allowed opacity-50',
    className,
  )
  const inner = checked && <Check size={13} strokeWidth={3} />

  if (!onChange) {
    return (
      <span role="checkbox" aria-checked={checked} aria-label={label} className={classes}>
        {inner}
      </span>
    )
  }
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={classes}
    >
      {inner}
    </button>
  )
}

interface RadioProps {
  checked: boolean
  onChange?: () => void
  disabled?: boolean
  label?: string
  className?: string
}

const radioBase =
  'flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border transition-colors'

export function Radio({ checked, onChange, disabled, label, className }: RadioProps) {
  const classes = cn(
    radioBase,
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
    checked ? 'border-brand-600' : 'border-border bg-surface',
    disabled && 'cursor-not-allowed opacity-50',
    className,
  )
  const inner = checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />

  if (!onChange) {
    return (
      <span role="radio" aria-checked={checked} aria-label={label} className={classes}>
        {inner}
      </span>
    )
  }
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={classes}
    >
      {inner}
    </button>
  )
}
