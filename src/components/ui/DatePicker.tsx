import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Build the 6-week grid (Monday-first) for a given month. */
function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.toDateString() === b.toDateString()
}

/** Calendar (assets/components/component-date-picker.png). */
export function DatePicker({
  value,
  onChange,
}: {
  value?: Date
  onChange?: (date: Date) => void
}) {
  const initial = value ?? new Date()
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() })
  const today = new Date()

  const step = (delta: number) => {
    const m = view.month + delta
    setView({ year: view.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 })
  }

  return (
    <div className="w-72 rounded-card border border-border bg-surface p-4 shadow-dropdown">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => step(-1)} aria-label="Previous month" className="rounded-control p-1 text-fg-muted hover:bg-surface-sunken">
          <ChevronLeft size={18} />
        </button>
        <span className="text-base font-semibold text-fg-strong">
          {MONTHS[view.month]} {view.year}
        </span>
        <button onClick={() => step(1)} aria-label="Next month" className="rounded-control p-1 text-fg-muted hover:bg-surface-sunken">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-center text-xs font-semibold text-fg-muted">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthGrid(view.year, view.month).map((date, i) => {
          if (!date) return <span key={i} />
          const selected = sameDay(date, value ?? null)
          const isToday = sameDay(date, today)
          return (
            <button
              key={i}
              onClick={() => onChange?.(date)}
              className={cn(
                'flex h-9 items-center justify-center rounded-full text-base transition-colors',
                selected
                  ? 'bg-brand-600 font-semibold text-white'
                  : 'text-fg hover:bg-surface-sunken',
                !selected && isToday && 'font-semibold text-brand-600',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
