import type { ReactNode } from 'react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

/** Thin wrapper around SearchableSelect for plain string-option selects. */
export function StringSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  error,
  renderValue,
}: {
  label?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  searchPlaceholder?: string
  error?: string
  renderValue?: (v: string) => ReactNode
}) {
  return (
    <SearchableSelect<string>
      label={label}
      required={required}
      value={value || null}
      onChange={onChange}
      options={options}
      getKey={(o) => o}
      getSearchText={(o) => o}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder ?? 'Search'}
      error={error}
      renderTrigger={(o) => (
        <span className="truncate text-base text-fg-strong">{renderValue ? renderValue(o) : o}</span>
      )}
      renderOption={(o) => <span className="text-base text-fg">{renderValue ? renderValue(o) : o}</span>}
    />
  )
}

/** Step heading: `Step N · Title` + helper paragraph. */
export function StepHeading({ index, title, helper }: { index: number; title: string; helper: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-fg-strong">
        Step {index} · {title}
      </h2>
      <p className="mt-1 text-base text-fg-muted">{helper}</p>
    </div>
  )
}
