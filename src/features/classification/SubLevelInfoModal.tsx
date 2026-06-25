import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, Table2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { DataAsset } from '@/data/schemas'
import { LEVEL_META } from './classificationMeta'
import type { SubLevel } from './subLevels'

interface Props {
  open: boolean
  subLevel: SubLevel
  asset: DataAsset
  onCancel: () => void
  onConfirm: () => void
}

function ContextCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xs font-semibold uppercase tracking-wide text-fg-muted">{label}</span>
      <div className="text-base font-semibold text-fg-strong">{children}</div>
    </div>
  )
}

/**
 * Per-level guidance modal shown after a sub level is picked. Themed by the
 * chosen level via LEVEL_META. Cancel returns to the Classify modal; Open
 * workbench confirms.
 */
export function SubLevelInfoModal({ open, subLevel, asset, onCancel, onConfirm }: Props) {
  const meta = LEVEL_META[subLevel.level]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 animate-fade-in bg-neutral-900/50 backdrop-blur-[1px]" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Classification level ${subLevel.level}`}
        className="relative z-10 my-4 w-full max-w-2xl animate-scale-in overflow-hidden rounded-card border border-border bg-surface shadow-modal"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-card py-4">
          <div className="flex items-start gap-3">
            <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', meta.soft)}>
              <AlertTriangle size={20} className={meta.text} />
            </span>
            <div>
              <h2 className={cn('text-lg font-bold', meta.text)}>
                Classification Level {subLevel.level}
              </h2>
              <p className="mt-0.5 text-base text-fg-muted">
                Review the level guidance before opening the classification workbench.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="rounded-full p-1 text-fg-subtle transition-colors hover:bg-surface-sunken hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-card py-5">
          {/* Context card */}
          <div className="grid grid-cols-1 gap-4 rounded-card border border-border bg-surface-sunken/40 p-4 sm:grid-cols-3">
            <ContextCell label="Target">
              <span className="flex items-center gap-2">
                <Table2 size={16} className="shrink-0 text-success-600" />
                <span className="truncate" title={asset.qualifiedName}>
                  {asset.qualifiedName}
                </span>
              </span>
            </ContextCell>
            <ContextCell label="Scheme">{subLevel.scheme}</ContextCell>
            <ContextCell label="Starting level">
              <span className={cn('inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-2.5 py-1 text-sm', meta.text)}>
                <span className={cn('h-2 w-2 rounded-full', meta.dot)} />
                {subLevel.level}
              </span>
            </ContextCell>
          </div>

          {/* Guidance */}
          <section className="mt-5">
            <h3 className="text-base font-bold text-fg-strong">Guidance</h3>
            <p className="mt-2 text-base leading-relaxed text-fg">{subLevel.guidance}</p>
          </section>

          {/* Example */}
          <section className="mt-5">
            <h3 className="text-base font-bold text-fg-strong">Example</h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {subLevel.examples.map((ex) => (
                <li key={ex} className="flex gap-2 text-base text-fg">
                  <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', meta.dot)} />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-sunken/40 px-card py-4">
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              'inline-flex h-9 items-center rounded-control border bg-surface px-4 text-base font-medium transition-colors',
              meta.outlineBtn,
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'inline-flex h-9 items-center rounded-control px-4 text-base font-medium transition-colors',
              meta.solidBtn,
            )}
          >
            Open workbench
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
