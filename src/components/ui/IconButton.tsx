import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type IconButtonVariant = 'ghost' | 'solid' | 'surface'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  /** Accessible label (required — icon-only control). */
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  active?: boolean
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: 'text-fg-muted hover:bg-surface-sunken hover:text-fg-strong',
  surface: 'bg-surface border border-border text-fg-muted shadow-sm hover:bg-surface-sunken',
  solid: 'bg-primary text-primary-fg hover:bg-primary-hover',
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8 rounded-control',
  md: 'h-9 w-9 rounded-control',
  lg: 'h-10 w-10 rounded-full',
}

const iconSize: Record<IconButtonSize, number> = { sm: 16, md: 18, lg: 20 }

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon: Icon, label, variant = 'ghost', size = 'md', active = false, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
        sizeClasses[size],
        variantClasses[variant],
        active && 'bg-brand-50 text-brand-600 hover:bg-brand-50',
        className,
      )}
      {...props}
    >
      <Icon size={iconSize[size]} strokeWidth={2} />
    </button>
  )
})
