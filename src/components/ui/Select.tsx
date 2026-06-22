import { ChevronDown } from 'lucide-react'
import { Popover, MenuItem } from './Popover'
import { Check } from 'lucide-react'

interface SelectProps<T extends string | number> {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  /** Open the menu above the trigger (use near the viewport bottom). */
  side?: 'bottom' | 'top'
  /** Optional prefix label, e.g. shown inline. */
  className?: string
}

/** Compact select used for "Results per page". */
export function Select<T extends string | number>({ value, options, onChange, side }: SelectProps<T>) {
  return (
    <Popover
      side={side}
      trigger={({ open, toggle, ref }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="inline-flex h-9 items-center gap-1.5 rounded-control border border-border bg-surface px-2.5 text-base font-medium text-fg-strong transition-colors hover:bg-surface-sunken"
        >
          {value}
          <ChevronDown size={15} className="text-fg-subtle" />
        </button>
      )}
      panelClassName="min-w-[5rem]"
    >
      {({ close }) =>
        options.map((opt) => (
          <MenuItem
            key={String(opt)}
            onClick={() => {
              onChange(opt)
              close()
            }}
          >
            <span className="flex w-full items-center justify-between">
              {opt}
              {opt === value && <Check size={15} className="text-brand-600" />}
            </span>
          </MenuItem>
        ))
      }
    </Popover>
  )
}
