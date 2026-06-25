import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { X, CheckCircle2, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'

type ModalTone = 'default' | 'positive' | 'warning' | 'negative' | 'info'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** Optional subtitle under the title. */
  description?: string
  tone?: ModalTone
  children?: ReactNode
  /** Footer actions (rendered right-aligned). */
  footer?: ReactNode
  /** Allow children (e.g. dropdown panels) to overflow the dialog without clipping. */
  overflowVisible?: boolean
  className?: string
}

const toneIcon = {
  positive: { Icon: CheckCircle2, cls: 'text-success-600 bg-success-50' },
  warning: { Icon: AlertTriangle, cls: 'text-warning-600 bg-warning-50' },
  negative: { Icon: AlertCircle, cls: 'text-danger-600 bg-danger-50' },
  info: { Icon: ShieldCheck, cls: 'text-brand-600 bg-brand-50' },
}

/** Hand-built dialog (assets/components/component-dialogue-box.png). No Radix. */
export function Modal({ open, onClose, title, description, tone = 'default', children, footer, overflowVisible = false, className }: ModalProps) {
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
          'relative z-10 w-full max-w-lg animate-scale-in rounded-card border border-border bg-surface shadow-modal',
          overflowVisible ? 'overflow-visible' : 'overflow-hidden',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-card py-4">
          <div className="flex items-start gap-3">
            {icon && (
              <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', icon.cls)}>
                <icon.Icon size={20} />
              </span>
            )}
            <div>
              <h2 className="text-lg font-semibold text-fg-strong">{title}</h2>
              {description && <p className="mt-0.5 text-base text-fg-muted">{description}</p>}
            </div>
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
