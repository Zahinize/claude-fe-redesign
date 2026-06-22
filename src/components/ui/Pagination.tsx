import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Select } from './Select'

interface PaginationProps {
  pageIndex: number // zero-based
  pageCount: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (size: number) => void
}

/** Build the "1 2 3 … 8 9 10" page-number sequence with ellipses. */
function pageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) out.push('ellipsis')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < total - 1) out.push('ellipsis')
  out.push(total)
  return out
}

/** Matches assets/components/component-pagination.png. */
export function Pagination({
  pageIndex,
  pageCount,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const current = pageIndex + 1
  const total = Math.max(1, pageCount)
  const arrowBtn =
    'flex h-8 w-8 items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-1 py-1">
      <div className="flex items-center gap-2 text-base text-fg-muted">
        <span>Results per page</span>
        <Select value={pageSize} options={pageSizeOptions} onChange={onPageSizeChange} side="top" />
      </div>

      <div className="flex items-center gap-1">
        <button className={arrowBtn} aria-label="First page" disabled={current === 1} onClick={() => onPageChange(0)}>
          <ChevronsLeft size={16} />
        </button>
        <button className={arrowBtn} aria-label="Previous page" disabled={current === 1} onClick={() => onPageChange(pageIndex - 1)}>
          <ChevronLeft size={16} />
        </button>
        {pageRange(current, total).map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="px-2 text-fg-subtle">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p - 1)}
              className={cn(
                'flex h-8 min-w-8 items-center justify-center rounded-control px-2 text-base transition-colors',
                p === current
                  ? 'font-semibold text-fg-strong'
                  : 'text-fg-muted hover:bg-surface-sunken',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button className={arrowBtn} aria-label="Next page" disabled={current === total} onClick={() => onPageChange(pageIndex + 1)}>
          <ChevronRight size={16} />
        </button>
        <button className={arrowBtn} aria-label="Last page" disabled={current === total} onClick={() => onPageChange(total - 1)}>
          <ChevronsRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-base text-fg-muted">
        <span>Page</span>
        <div className="flex items-center gap-1 rounded-control border border-border bg-surface px-2.5 py-1">
          <span className="tnum min-w-4 text-center font-medium text-fg-strong">{current}</span>
          <div className="flex flex-col">
            <button
              aria-label="Next page"
              disabled={current === total}
              onClick={() => onPageChange(pageIndex + 1)}
              className="text-fg-subtle hover:text-fg disabled:opacity-30"
            >
              <ChevronUp size={12} />
            </button>
            <button
              aria-label="Previous page"
              disabled={current === 1}
              onClick={() => onPageChange(pageIndex - 1)}
              className="text-fg-subtle hover:text-fg disabled:opacity-30"
            >
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
