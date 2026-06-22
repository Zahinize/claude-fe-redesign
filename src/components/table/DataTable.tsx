import { useRef } from 'react'
import { flexRender } from '@tanstack/react-table'
import type { Table as TanstackTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const ROW_HEIGHT = 52

interface DataTableProps<T> {
  table: TanstackTable<T>
  /** Called when a body row is clicked. */
  onRowClick?: (row: T) => void
  /** Total rows after filtering (for the empty-state check). */
  emptyState?: React.ReactNode
}

/**
 * Virtualized table shell — TanStack Table for state/logic + react-virtual for
 * rows, so 100k rows render only ~30 nodes. Sortable sticky header, zebra rows,
 * matching assets/components/component-table.png.
 */
export function DataTable<T>({ table, onRowClick, emptyState }: DataTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  const paddingTop = virtualRows.length ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length ? totalSize - virtualRows[virtualRows.length - 1].end : 0

  return (
    <div ref={scrollRef} className="relative h-full overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-base">
        <thead className="sticky top-0 z-10">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="whitespace-nowrap border-b border-border bg-surface-sunken/80 px-4 py-3 text-left text-sm font-medium text-fg-muted backdrop-blur"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        disabled={!canSort}
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          'flex items-center gap-1.5',
                          canSort && 'cursor-pointer select-none hover:text-fg',
                        )}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="text-fg-subtle">
                            {sorted === 'asc' ? (
                              <ArrowUp size={13} />
                            ) : sorted === 'desc' ? (
                              <ArrowDown size={13} />
                            ) : (
                              <ChevronsUpDown size={13} />
                            )}
                          </span>
                        )}
                      </button>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} colSpan={table.getAllColumns().length} />
            </tr>
          )}
          {virtualRows.map((vr) => {
            const row = rows[vr.index]
            return (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  'group transition-colors',
                  vr.index % 2 === 1 ? 'bg-surface-zebra' : 'bg-surface',
                  onRowClick && 'cursor-pointer hover:bg-brand-50/50',
                )}
                style={{ height: ROW_HEIGHT }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="border-b border-border px-4 text-base text-fg"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom }} colSpan={table.getAllColumns().length} />
            </tr>
          )}
        </tbody>
      </table>
      {rows.length === 0 && emptyState}
    </div>
  )
}
