import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchInputProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  /** Debounce in ms before firing onValueChange (default 200). */
  debounce?: number
  /** Optional keyboard hint pill, e.g. "Alt+K". */
  shortcut?: string
  className?: string
  autoFocus?: boolean
}

/**
 * Debounced search field with a clear button and optional shortcut hint —
 * used in the topbar (Alt+K) and the consent list toolbar.
 */
export function SearchInput({
  value,
  onValueChange,
  placeholder = 'Search',
  debounce = 200,
  shortcut,
  className,
  autoFocus,
}: SearchInputProps) {
  const [local, setLocal] = useState(value ?? '')

  // Keep in sync if the parent resets the value externally.
  useEffect(() => {
    if (value !== undefined) setLocal(value)
  }, [value])

  useEffect(() => {
    const t = setTimeout(() => onValueChange(local), debounce)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounce])

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-input border border-border bg-surface px-3 transition-colors focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50',
        className,
      )}
    >
      <Search size={16} className="shrink-0 text-fg-subtle" />
      <input
        type="text"
        value={local}
        autoFocus={autoFocus}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full bg-transparent text-base text-fg-strong outline-none placeholder:text-fg-subtle"
      />
      {local ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setLocal('')}
          className="shrink-0 rounded-full p-0.5 text-fg-subtle hover:bg-surface-sunken hover:text-fg"
        >
          <X size={15} />
        </button>
      ) : (
        shortcut && (
          <kbd className="shrink-0 rounded border border-border bg-surface-sunken px-1.5 py-0.5 text-2xs font-medium text-fg-muted">
            {shortcut}
          </kbd>
        )
      )}
    </div>
  )
}
