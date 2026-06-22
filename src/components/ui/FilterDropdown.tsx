import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Popover } from './Popover'
import { Checkbox } from './Checkbox'

interface FilterDropdownProps {
  /** Field label, e.g. "Status". */
  label: string
  options: string[]
  /** Currently selected values (empty = "All"). */
  selected: string[]
  onChange: (next: string[]) => void
}

/**
 * Multi-select filter shown as "Status: All ▾" in the consent list toolbar.
 * Uses the checkbox-list dropdown variant from the component library.
 */
export function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const summary = selected.length === 0 ? 'All' : selected.length === 1 ? selected[0] : `${selected.length}`

  function toggle(option: string) {
    onChange(
      selected.includes(option) ? selected.filter((s) => s !== option) : [...selected, option],
    )
  }

  return (
    <Popover
      trigger={({ open, toggle: t, ref }) => (
        <button
          ref={ref}
          type="button"
          onClick={t}
          className={cn(
            'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-control border bg-surface px-3 text-base transition-colors',
            open ? 'border-brand-500 ring-4 ring-brand-50' : 'border-border hover:bg-surface-sunken',
            selected.length > 0 ? 'text-fg-strong' : 'text-fg-muted',
          )}
        >
          <span className="text-fg-muted">{label}:</span>
          <span className="font-medium text-fg-strong">{summary}</span>
          <ChevronDown size={15} className="text-fg-subtle" />
        </button>
      )}
      panelClassName="min-w-[13rem]"
    >
      {() => (
        <div>
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <span className="text-xs font-medium text-fg-muted">Filter {label}</span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className="flex w-full items-center gap-2.5 rounded-chip px-2.5 py-2 text-left text-base text-fg hover:bg-surface-sunken"
              >
                <Checkbox checked={selected.includes(option)} />
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </Popover>
  )
}
