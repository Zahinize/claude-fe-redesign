import { useMemo, useRef, useState } from 'react'
import { X, AlertTriangle, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useOnClickOutside } from '@/lib/useOnClickOutside'

export interface TagSelectOption {
  value: string
  label: string
  sensitive?: boolean
}

interface TagSelectProps {
  label?: string
  required?: boolean
  helper?: string
  error?: string
  value: string[]
  onChange: (next: string[]) => void
  options: TagSelectOption[]
  allowCustom?: boolean
  placeholder?: string
  /** Empty-state caption shown in the chips area. */
  emptyText?: string
}

type TagVariant = 'default' | 'sensitive' | 'custom'

/** lowercase + underscores so custom tags read like the preset codes. */
function slug(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, '_')
}

/**
 * Creatable searchable multi-select. Chips are colored by variant: preset = brand,
 * sensitive preset = danger + ⚠, custom = warning + "CUSTOM". Hand-built, no Radix.
 */
export function TagSelect({
  label,
  required,
  helper,
  error,
  value,
  onChange,
  options,
  allowCustom = true,
  placeholder = 'Type to search or add your own',
  emptyText = 'No tags selected yet',
}: TagSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useOnClickOutside(containerRef, () => setOpen(false), open)

  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options])
  const invalid = Boolean(error)

  function variantOf(v: string): TagVariant {
    const opt = byValue.get(v)
    if (!opt) return 'custom'
    return opt.sensitive ? 'sensitive' : 'default'
  }
  function labelOf(v: string): string {
    return byValue.get(v)?.label ?? v
  }

  const available = options.filter(
    (o) =>
      !value.includes(o.value) &&
      (o.label.toLowerCase().includes(query.toLowerCase()) ||
        o.value.toLowerCase().includes(query.toLowerCase())),
  )

  const trimmed = query.trim()
  const customValue = slug(trimmed)
  const canCreate =
    allowCustom &&
    trimmed.length > 0 &&
    !value.includes(customValue) &&
    !options.some((o) => o.value === customValue)

  function add(v: string) {
    if (!value.includes(v)) onChange([...value, v])
    setQuery('')
    inputRef.current?.focus()
  }
  function remove(v: string) {
    onChange(value.filter((x) => x !== v))
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (available.length > 0) add(available[0].value)
      else if (canCreate) add(customValue)
    } else if (e.key === 'Backspace' && query === '' && value.length > 0) {
      remove(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const chipClasses: Record<TagVariant, string> = {
    default: 'bg-brand-50 text-brand-700 ring-brand-100',
    sensitive: 'bg-danger-50 text-danger-700 ring-danger-100',
    custom: 'bg-warning-50 text-warning-700 ring-warning-100',
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-fg">
          {label}
          {required && <span className="ml-0.5 text-danger-500">*</span>}
        </label>
      )}
      {helper && <p className="-mt-0.5 text-sm text-fg-muted">{helper}</p>}

      <div ref={containerRef} className="relative">
        <div
          onClick={() => {
            setOpen(true)
            inputRef.current?.focus()
          }}
          className={cn(
            'cursor-text rounded-input border bg-surface transition-colors',
            open
              ? invalid
                ? 'border-danger-500 ring-4 ring-danger-50'
                : 'border-brand-500 ring-4 ring-brand-50'
              : invalid
                ? 'border-danger-500'
                : 'border-border',
          )}
        >
          {/* chips */}
          <div className="flex flex-wrap items-center gap-2 px-3 pt-2.5">
            {value.length === 0 ? (
              <span className="py-0.5 text-base text-fg-subtle">{emptyText}</span>
            ) : (
              value.map((v) => {
                const variant = variantOf(v)
                return (
                  <span
                    key={v}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-chip px-2 py-1 text-sm font-medium ring-1 ring-inset',
                      chipClasses[variant],
                    )}
                  >
                    {variant === 'sensitive' && <AlertTriangle size={13} />}
                    {labelOf(v)}
                    {variant === 'custom' && (
                      <span className="rounded bg-warning-100 px-1 py-px text-2xs font-bold uppercase tracking-wide text-warning-700">
                        custom
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${labelOf(v)}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        remove(v)
                      }}
                      className="rounded-full p-0.5 hover:bg-black/5"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )
              })
            )}
          </div>
          {/* search */}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent px-3 pb-2.5 pt-2 text-base text-fg-strong outline-none placeholder:text-fg-subtle"
          />
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 animate-scale-in overflow-y-auto rounded-card border border-border bg-surface p-1.5 shadow-dropdown">
            {canCreate && (
              <button
                type="button"
                onClick={() => add(customValue)}
                className="flex w-full items-center gap-2 rounded-control px-3 py-2.5 text-left text-base text-fg hover:bg-surface-sunken"
              >
                <Plus size={15} className="text-fg-muted" />
                Add “<span className="font-semibold text-fg-strong">{customValue}</span>” as a custom value
              </button>
            )}
            {!canCreate && allowCustom && query === '' && (
              <p className="flex items-center gap-2 px-3 py-2 text-sm text-fg-muted">
                <Plus size={14} /> Don't see your option? Type to add a custom value.
              </p>
            )}
            {available.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => add(o.value)}
                className="flex w-full items-center justify-between gap-2 rounded-control px-3 py-2.5 text-left text-base text-fg hover:bg-surface-sunken"
              >
                <span className="flex items-center gap-2">
                  {o.sensitive && <AlertTriangle size={14} className="text-danger-500" />}
                  {o.label}
                </span>
                {o.sensitive && <span className="text-2xs font-semibold uppercase text-danger-600">sensitive</span>}
              </button>
            ))}
            {available.length === 0 && !canCreate && (
              <p className="px-3 py-6 text-center text-sm text-fg-muted">No matching options</p>
            )}
          </div>
        )}
      </div>

      {(error || helper) && error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  )
}
