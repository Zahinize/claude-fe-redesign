import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Tones mirror assets/components/component-alert-buttons.png + alert-colors.png:
// success(green), brand(blue, e.g. "Marketing"), info(soft blue), warning/medium(amber),
// danger/high(soft red), critical(solid red), neutral/low(gray).
export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'critical'

export type BadgeVariant = 'soft' | 'solid' | 'outline'

interface BadgeProps {
  tone?: BadgeTone
  variant?: BadgeVariant
  /** Leading status dot. */
  dot?: boolean
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}

const softClasses: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600 ring-neutral-200',
  brand: 'bg-brand-50 text-brand-600 ring-brand-100',
  info: 'bg-brand-50 text-brand-600 ring-brand-100',
  success: 'bg-success-50 text-success-600 ring-success-100',
  warning: 'bg-warning-50 text-warning-600 ring-warning-100',
  danger: 'bg-danger-50 text-danger-600 ring-danger-100',
  critical: 'bg-danger-50 text-danger-700 ring-danger-100',
}

const solidClasses: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-500 text-white ring-transparent',
  brand: 'bg-brand-600 text-white ring-transparent',
  info: 'bg-brand-600 text-white ring-transparent',
  success: 'bg-success-600 text-white ring-transparent',
  warning: 'bg-warning-500 text-white ring-transparent',
  danger: 'bg-danger-600 text-white ring-transparent',
  critical: 'bg-danger-700 text-white ring-transparent',
}

const outlineClasses: Record<BadgeTone, string> = {
  neutral: 'bg-transparent text-neutral-600 ring-neutral-300',
  brand: 'bg-transparent text-brand-600 ring-brand-200',
  info: 'bg-transparent text-brand-600 ring-brand-200',
  success: 'bg-transparent text-success-600 ring-success-100',
  warning: 'bg-transparent text-warning-600 ring-warning-100',
  danger: 'bg-transparent text-danger-600 ring-danger-100',
  critical: 'bg-transparent text-danger-700 ring-danger-100',
}

const dotClasses: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-400',
  brand: 'bg-brand-500',
  info: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  critical: 'bg-danger-700',
}

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  size = 'md',
  className,
  children,
}: BadgeProps) {
  const toneClasses =
    variant === 'solid' ? solidClasses : variant === 'outline' ? outlineClasses : softClasses
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-chip font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-1.5 py-0.5 text-2xs' : 'px-2 py-0.5 text-xs',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} />}
      {children}
    </span>
  )
}
