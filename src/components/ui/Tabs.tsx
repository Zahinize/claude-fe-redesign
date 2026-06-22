import { useRef } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
}

/**
 * Underline tab bar (consent detail). Keyboard-navigable (arrow keys), no Radix.
 */
export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (index + dir + tabs.length) % tabs.length
    refs.current[next]?.focus()
    onChange(tabs[next].id)
  }

  return (
    <div
      role="tablist"
      className={cn('flex items-center gap-6 border-b border-border', className)}
    >
      {tabs.map((tab, i) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'relative -mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 pb-3 pt-1 text-base font-medium transition-colors focus-visible:outline-none',
              active
                ? 'border-fg-strong text-fg-strong'
                : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={cn(
                  'rounded-pill px-1.5 py-0.5 text-2xs font-semibold',
                  active ? 'bg-brand-50 text-brand-600' : 'bg-neutral-100 text-fg-muted',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
