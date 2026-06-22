import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, AlertTriangle, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastTone = 'success' | 'error' | 'warning'

interface ToastItem {
  id: number
  tone: ToastTone
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneConfig: Record<ToastTone, { Icon: typeof CheckCircle2; ring: string; icon: string; text: string }> = {
  success: { Icon: CheckCircle2, ring: 'border-success-100', icon: 'text-success-600', text: 'text-success-700' },
  error: { Icon: AlertCircle, ring: 'border-danger-100', icon: 'text-danger-600', text: 'text-danger-700' },
  warning: { Icon: AlertTriangle, ring: 'border-warning-100', icon: 'text-warning-600', text: 'text-warning-700' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const remove = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = ++idRef.current
      setItems((list) => [...list, { ...t, id }])
      setTimeout(() => remove(id), 4000)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-3">
          {items.map((t) => {
            const c = toneConfig[t.tone]
            return (
              <div
                key={t.id}
                className={cn(
                  'pointer-events-auto flex animate-slide-up items-center gap-3 rounded-card border bg-surface px-4 py-3 shadow-dropdown',
                  c.ring,
                )}
              >
                <c.Icon size={20} className={cn('shrink-0', c.icon)} />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className={cn('whitespace-nowrap font-semibold', c.text)}>{t.title}</span>
                  {t.description && (
                    <>
                      <ArrowRight size={14} className="shrink-0 text-fg-subtle" />
                      <span className="truncate text-base text-fg-muted">{t.description}</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => remove(t.id)}
                  className="shrink-0 rounded-full p-0.5 text-fg-subtle hover:bg-surface-sunken hover:text-fg"
                >
                  <X size={15} />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
