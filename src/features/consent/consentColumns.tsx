import { createColumnHelper } from '@tanstack/react-table'
import type { FilterFn } from '@tanstack/react-table'
import { Badge } from '@/components/ui/Badge'
import { StatusChip } from '@/components/ui/StatusChip'
import { formatDateTime } from '@/lib/format'
import type { ConsentRow } from '@/data/schemas'

const col = createColumnHelper<ConsentRow>()

/** Multi-select column filter — empty selection means "All". */
export const multiSelectFilter: FilterFn<ConsentRow> = (row, columnId, value: string[]) => {
  if (!value || value.length === 0) return true
  return value.includes(row.getValue<string>(columnId))
}

/** Global search over the precomputed lowercase blob. */
export const searchFilter: FilterFn<ConsentRow> = (row, _columnId, value: string) => {
  if (!value) return true
  return row.original._search.includes(value.toLowerCase())
}

export const consentColumns = [
  col.accessor('id', {
    header: 'Consent ID',
    size: 140,
    cell: (c) => (
      <span className="whitespace-nowrap font-semibold text-fg-strong tnum">{c.getValue()}</span>
    ),
  }),
  col.accessor('subjectName', {
    header: 'Data Subject',
    size: 156,
    cell: (c) => (
      <Badge tone="brand" className="max-w-full truncate">
        {c.getValue()}
      </Badge>
    ),
  }),
  col.accessor('type', {
    header: 'Type',
    size: 116,
    filterFn: multiSelectFilter,
    cell: (c) => <span className="text-fg">{c.getValue()}</span>,
  }),
  col.accessor('purpose', {
    header: 'Purpose',
    size: 156,
    cell: (c) => <span className="text-fg">{c.getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    size: 120,
    filterFn: multiSelectFilter,
    cell: (c) => <StatusChip status={c.getValue()} dot={false} />,
  }),
  col.accessor('version', {
    header: 'Version',
    size: 90,
    cell: (c) => <span className="text-fg-muted tnum">{c.getValue()}</span>,
  }),
  col.accessor('dateGiven', {
    header: 'Date Given',
    size: 165,
    cell: (c) => <span className="whitespace-nowrap text-fg-muted tnum">{formatDateTime(c.getValue())}</span>,
  }),
  col.accessor('expiryDate', {
    header: 'Expiry Date',
    size: 165,
    cell: (c) => <span className="whitespace-nowrap text-fg-muted tnum">{formatDateTime(c.getValue())}</span>,
  }),
  col.accessor('channel', {
    header: 'Channel',
    size: 120,
    filterFn: multiSelectFilter,
    cell: (c) => <Badge tone="neutral">{c.getValue()}</Badge>,
  }),
  col.accessor('linkedActivity', {
    header: 'Linked Activity',
    size: 130,
    enableSorting: false,
    cell: (c) => <span className="text-brand-600 tnum">{c.getValue()}</span>,
  }),
]
