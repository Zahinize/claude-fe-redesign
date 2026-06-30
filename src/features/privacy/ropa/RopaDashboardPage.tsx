import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Plus, Eye, FileText } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { IconButton } from '@/components/ui/IconButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingBlock } from '@/components/ui/Spinner'
import { formatDateTime, formatNumber } from '@/lib/format'
import { ROPA_STATUSES, ROPA_RISKS } from '@/data/schemas'
import { useRopaActivities } from './useRopa'
import { STATUS_TONE, RISK_TONE } from './ropaMeta'
import { legalBasisLabel } from './ropaFormat'

const ALL = 'All'

function LabeledFilter<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-0.5 text-xs font-medium text-fg-muted">{label}</span>
      <Select value={value} options={options} onChange={onChange} />
    </div>
  )
}

const COLS = 'grid grid-cols-[1.6fr_1.3fr_1fr_0.8fr_0.9fr_1.2fr_1.2fr_auto] items-center gap-4'

export function RopaDashboardPage() {
  const navigate = useNavigate()
  const { data: activities, isLoading } = useRopaActivities()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const [risk, setRisk] = useState<string>(ALL)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (activities ?? []).filter((a) => {
      if (status !== ALL && a.status !== status) return false
      if (risk !== ALL && a.risk !== risk) return false
      if (q && !`${a.name} ${a.purpose} ${a.legalBasis ?? ''}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [activities, search, status, risk])

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-5 py-5 sm:px-6">
      <Breadcrumb
        icon={ShieldCheck}
        items={[{ label: 'Data Privacy', to: '/consent' }, { label: 'RoPA' }]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-fg-strong">Records of Processing Activities</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Maintain your PDPL Article 31 register · {formatNumber(rows.length)} activities
          </p>
        </div>
        <Button variant="primary" leftIcon={Plus} onClick={() => navigate('/privacy/ropa/new')}>
          Create RoPA Activity
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="self-end">
          <SearchInput value={search} onValueChange={setSearch} placeholder="Search activities" className="w-64" />
        </div>
        <LabeledFilter label="Status" value={status} options={[ALL, ...ROPA_STATUSES]} onChange={setStatus} />
        <LabeledFilter label="Risk" value={risk} options={[ALL, ...ROPA_RISKS]} onChange={setRisk} />
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <LoadingBlock label="Loading register…" />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No activities yet"
            description="Create your first Record of Processing Activity to start the register."
            action={
              <Button variant="primary" leftIcon={Plus} onClick={() => navigate('/privacy/ropa/new')}>
                Create RoPA Activity
              </Button>
            }
          />
        ) : (
          <div className="min-w-[60rem]">
            <div className={`${COLS} border-b border-border bg-surface-sunken/60 px-card py-3 text-xs font-medium text-fg-muted`}>
              <span>Name</span>
              <span>Purpose</span>
              <span>Legal basis</span>
              <span>Risk</span>
              <span>Status</span>
              <span>Next review</span>
              <span>Updated</span>
              <span className="text-right">Actions</span>
            </div>
            {rows.map((a, i) => (
              <div
                key={a.id}
                onClick={() => navigate(`/privacy/ropa/${a.id}`)}
                className={`${COLS} cursor-pointer border-b border-border px-card py-3.5 text-base transition-colors hover:bg-brand-50/40 ${i % 2 ? 'bg-surface-zebra/40' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <span className="truncate font-semibold text-fg-strong">{a.name}</span>
                  {a.sensitive && (
                    <Badge tone="warning" size="sm">
                      Sensitive
                    </Badge>
                  )}
                </span>
                <span className="truncate text-fg">{a.purpose}</span>
                <span className="truncate text-fg-muted">{legalBasisLabel(a.legalBasis)}</span>
                <span>
                  <Badge tone={RISK_TONE[a.risk]} dot>
                    {a.risk}
                  </Badge>
                </span>
                <span>
                  <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                </span>
                <span className="whitespace-nowrap text-fg-muted tnum">
                  {a.nextReview ? formatDateTime(a.nextReview) : '—'}
                </span>
                <span className="whitespace-nowrap text-fg-muted tnum">{formatDateTime(a.updatedAt)}</span>
                <span className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <IconButton icon={Eye} label="View activity" size="sm" onClick={() => navigate(`/privacy/ropa/${a.id}`)} />
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
