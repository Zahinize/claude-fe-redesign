import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { Download, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingBlock } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/Page'
import { DataTable } from '@/components/table/DataTable'
import { useToast } from '@/components/ui/Toast'
import { toCsv, downloadCsv } from '@/lib/csv'
import { formatNumber, formatDateTime } from '@/lib/format'
import { CONSENT_STATUSES, CONSENT_TYPES, CHANNELS } from '@/data/schemas'
import type { ConsentRow } from '@/data/schemas'
import { useConsents } from './useConsents'
import { consentColumns, searchFilter } from './consentColumns'

export function ConsentListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: rows, isLoading } = useConsents()

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })

  const data = rows ?? []

  const table = useReactTable<ConsentRow>({
    data,
    columns: consentColumns,
    state: { globalFilter, sorting, columnFilters, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    globalFilterFn: searchFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const filteredCount = table.getFilteredRowModel().rows.length

  // Column-filter helpers bound to the dropdowns.
  const filterValue = (id: string) =>
    (columnFilters.find((f) => f.id === id)?.value as string[] | undefined) ?? []
  const setFilter = (id: string, value: string[]) =>
    setColumnFilters((prev) => [...prev.filter((f) => f.id !== id), ...(value.length ? [{ id, value }] : [])])

  function handleExport() {
    const filtered = table.getFilteredRowModel().rows.map((r) => ({
      ...r.original,
      dateGiven: formatDateTime(r.original.dateGiven),
      expiryDate: formatDateTime(r.original.expiryDate),
    }))
    const csv = toCsv(filtered, [
      { key: 'id', header: 'Consent ID' },
      { key: 'subjectName', header: 'Data Subject' },
      { key: 'subjectEmail', header: 'Email' },
      { key: 'type', header: 'Type' },
      { key: 'purpose', header: 'Purpose' },
      { key: 'status', header: 'Status' },
      { key: 'version', header: 'Version' },
      { key: 'dateGiven', header: 'Date Given' },
      { key: 'expiryDate', header: 'Expiry Date' },
      { key: 'channel', header: 'Channel' },
      { key: 'linkedActivity', header: 'Linked Activity' },
    ])
    downloadCsv('consent-records.csv', csv)
    toast({ tone: 'success', title: 'Export ready', description: `${formatNumber(filtered.length)} records exported` })
  }

  const toolbar = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={globalFilter}
          onValueChange={setGlobalFilter}
          placeholder="Search records"
          className="w-56"
        />
        <FilterDropdown label="Status" options={[...CONSENT_STATUSES]} selected={filterValue('status')} onChange={(v) => setFilter('status', v)} />
        <FilterDropdown label="Type" options={[...CONSENT_TYPES]} selected={filterValue('type')} onChange={(v) => setFilter('type', v)} />
        <FilterDropdown label="Channel" options={[...CHANNELS]} selected={filterValue('channel')} onChange={(v) => setFilter('channel', v)} />
        <Button variant="primary" leftIcon={Download} onClick={handleExport}>
          Export
        </Button>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalFilter, columnFilters],
  )

  return (
    <div className="flex h-full flex-col gap-4 px-5 py-5 sm:px-6">
      <PageHeader
        title="Consent Management"
        description={`Manage all consent records and their lifecycle status · ${formatNumber(filteredCount)} records`}
        actions={toolbar}
      />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1">
          {isLoading ? (
            <LoadingBlock label="Generating 100,000 consent records…" />
          ) : (
            <DataTable
              table={table}
              onRowClick={(row) => navigate(`/consent/${row.id}`)}
              emptyState={
                <EmptyState
                  icon={SearchX}
                  title="No matching records"
                  description="Try adjusting your search or filters."
                />
              }
            />
          )}
        </div>
        <div className="border-t border-border px-3 py-2">
          <Pagination
            pageIndex={pagination.pageIndex}
            pageCount={table.getPageCount()}
            pageSize={pagination.pageSize}
            pageSizeOptions={[20, 50, 100]}
            onPageChange={(i) => table.setPageIndex(i)}
            onPageSizeChange={(s) => table.setPageSize(s)}
          />
        </div>
      </Card>
    </div>
  )
}
