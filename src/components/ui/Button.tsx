import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'danger-soft'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  loading?: boolean
  children?: ReactNode
}

// Variants mirror assets/components/component-button.png:
// primary = dark navy/ink, secondary = white+border, outline, ghost = text-only,
// danger = solid red, danger-soft = soft-red (e.g. "Record Withdrawal").
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary-hover disabled:bg-neutral-200 disabled:text-fg-subtle',
  secondary:
    'bg-surface text-fg-strong border border-border shadow-sm hover:bg-surface-sunken disabled:text-fg-subtle',
  outline:
    'bg-transparent text-fg-strong border border-border hover:bg-surface-sunken disabled:text-fg-subtle',
  ghost: 'bg-transparent text-fg hover:bg-surface-sunken disabled:text-fg-subtle',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 disabled:bg-neutral-200',
  'danger-soft':
    'bg-danger-50 text-danger-600 border border-danger-100 hover:bg-danger-100 disabled:opacity-60',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-control',
  md: 'h-9 px-4 text-base gap-2 rounded-control',
  lg: 'h-11 px-5 text-base gap-2 rounded-control',
}

const iconSize: Record<ButtonSize, number> = { sm: 15, md: 16, lg: 18 }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    loading = false,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
        'disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={iconSize[size]} className="animate-spin" />
      ) : (
        LeftIcon && <LeftIcon size={iconSize[size]} strokeWidth={2} />
      )}
      {children}
      {!loading && RightIcon && <RightIcon size={iconSize[size]} strokeWidth={2} />}
    </button>
  )
})
