import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useOnClickOutside } from '@/lib/useOnClickOutside'

interface SearchableSelectProps<T> {
  /** Field label rendered above the control. */
  label?: string
  value: T | null
  onChange: (option: T) => void
  options: T[]
  getKey: (option: T) => string
  /** Text to match against when filtering. */
  getSearchText: (option: T) => string
  /** Placeholder shown when nothing is selected. */
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
  /** Rich display of the selected option inside the trigger. */
  renderTrigger: (option: T) => ReactNode
  /** Row rendered for each option in the open panel. */
  renderOption: (option: T, selected: boolean) => ReactNode
  emptyText?: string
  /** Optional required marker + inline error (form use). */
  required?: boolean
  error?: string
}

/**
 * Hand-built searchable single-select (no Radix). A labelled trigger that opens
 * an in-place panel with a search field + scrollable option list. Disabled
 * triggers are inert and muted — used for the cascading Classify Data dropdowns.
 */
export function SearchableSelect<T>({
  label,
  value,
  onChange,
  options,
  getKey,
  getSearchText,
  placeholder,
  searchPlaceholder = 'Search',
  disabled = false,
  renderTrigger,
  renderOption,
  emptyText = 'No results found',
  required,
  error,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => setOpen(false), open)

  const filtered = query
    ? options.filter((o) => getSearchText(o).toLowerCase().includes(query.toLowerCase()))
    : options

  function toggle() {
    if (disabled) return
    setOpen((o) => {
      const next = !o
      if (next) setQuery('')
      return next
    })
  }

  const invalid = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-semibold text-fg-strong">
          {label}
          {required && <span className="ml-0.5 text-danger-500">*</span>}
        </span>
      )}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          onClick={toggle}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-input border px-3.5 text-left transition-colors',
            value ? 'py-2.5' : 'h-11',
            disabled
              ? 'cursor-not-allowed border-border bg-surface-sunken text-fg-subtle'
              : open
                ? cn('bg-surface ring-4', invalid ? 'border-danger-500 ring-danger-50' : 'border-brand-500 ring-brand-50')
                : invalid
                  ? 'border-danger-500 bg-surface'
                  : 'border-border bg-surface hover:border-border-strong',
          )}
        >
          {value ? (
            <span className="min-w-0 flex-1">{renderTrigger(value)}</span>
          ) : (
            <span className={cn('truncate text-base', disabled ? 'text-fg-subtle' : 'text-fg-muted')}>
              {placeholder}
            </span>
          )}
          <ChevronDown size={18} className={cn('shrink-0', disabled ? 'text-fg-subtle' : 'text-fg-muted')} />
        </button>

        {open && !disabled && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1.5 animate-scale-in overflow-hidden rounded-card border border-border bg-surface shadow-dropdown">
            <div className="border-b border-border p-2">
              <div className="flex items-center gap-2 rounded-control border border-border bg-surface px-3 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50">
                <Search size={16} className="shrink-0 text-fg-subtle" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full bg-transparent text-base text-fg-strong outline-none placeholder:text-fg-subtle"
                />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-fg-muted">{emptyText}</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {filtered.map((option) => {
                    const selected = value != null && getKey(option) === getKey(value)
                    return (
                      <button
                        key={getKey(option)}
                        type="button"
                        onClick={() => {
                          onChange(option)
                          setOpen(false)
                        }}
                        className={cn(
                          'w-full rounded-control border px-3 py-2.5 text-left transition-colors',
                          selected
                            ? 'border-brand-200 bg-brand-50/60'
                            : 'border-border bg-surface hover:border-border-strong hover:bg-surface-sunken/60',
                        )}
                      >
                        {renderOption(option, selected)}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  )
}
