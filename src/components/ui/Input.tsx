import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: LucideIcon
  rightSlot?: ReactNode
  containerClassName?: string
}

/**
 * Text input matching assets/components/component-input.png:
 * optional label, icon slot, hint text, and error/focus states.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon: LeftIcon, rightSlot, className, containerClassName, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const invalid = Boolean(error)
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-input border bg-surface px-3 transition-colors',
          'focus-within:ring-4',
          invalid
            ? 'border-danger-500 focus-within:border-danger-500 focus-within:ring-danger-50'
            : 'border-border focus-within:border-brand-500 focus-within:ring-brand-50',
          props.disabled && 'cursor-not-allowed bg-surface-sunken',
        )}
      >
        {LeftIcon && <LeftIcon size={16} className="shrink-0 text-fg-subtle" />}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={invalid}
          className={cn(
            'h-9 w-full bg-transparent text-base text-fg-strong outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        {rightSlot}
      </div>
      {(error || hint) && (
        <p className={cn('text-xs', invalid ? 'text-danger-600' : 'text-fg-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
})
