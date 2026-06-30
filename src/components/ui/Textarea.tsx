import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  containerClassName?: string
}

/** Multiline text field matching Input's styling (label / hint / error). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, className, containerClassName, id, rows = 3, ...props },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const invalid = Boolean(error)
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-fg">
          {label}
          {required && <span className="ml-0.5 text-danger-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={invalid}
        className={cn(
          'w-full resize-y rounded-input border bg-surface px-3 py-2 text-base text-fg-strong outline-none transition-colors placeholder:text-fg-subtle focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface-sunken',
          invalid
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-50'
            : 'border-border focus:border-brand-500 focus:ring-brand-50',
          className,
        )}
        {...props}
      />
      {(error || hint) && (
        <p className={cn('text-xs', invalid ? 'text-danger-600' : 'text-fg-muted')}>{error ?? hint}</p>
      )}
    </div>
  )
})
