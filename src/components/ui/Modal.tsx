import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { X, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

type ModalTone = 'default' | 'positive' | 'warning' | 'negative'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  tone?: ModalTone
  children?: ReactNode
  /** Footer actions (rendered right-aligned). */
  footer?: ReactNode
  className?: string
}

const toneIcon = {
  positive: { Icon: CheckCircle2, cls: 'text-success-600 bg-success-50' },
  warning: { Icon: AlertTriangle, cls: 'text-warning-600 bg-warning-50' },
  negative: { Icon: AlertCircle, cls: 'text-danger-600 bg-danger-50' },
}

/** Hand-built dialog (assets/components/component-dialogue-box.png). No Radix. */
export function Modal({ open, onClose, title, tone = 'default', children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  const icon = tone !== 'default' ? toneIcon[tone] : null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 animate-fade-in bg-neutral-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 w-full max-w-lg animate-scale-in overflow-hidden rounded-card border border-border bg-surface shadow-modal',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-card py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', icon.cls)}>
                <icon.Icon size={20} />
              </span>
            )}
            <h2 className="text-lg font-semibold text-fg-strong">{title}</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-fg-subtle transition-colors hover:bg-surface-sunken hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>
        {children && <div className="px-card py-5 text-base text-fg">{children}</div>}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-sunken/40 px-card py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
