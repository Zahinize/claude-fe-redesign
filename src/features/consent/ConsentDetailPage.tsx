import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, FileX2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { StatusChip } from '@/components/ui/StatusChip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { useConsentDetail, useConsentMutations } from './useConsents'
import { OverviewTab } from './tabs/OverviewTab'
import { ScopePurposesTab } from './tabs/ScopePurposesTab'
import { EvidenceTab } from './tabs/EvidenceTab'
import { LifecycleTab } from './tabs/LifecycleTab'
import { AuditTrailsTab } from './tabs/AuditTrailsTab'
import { RecordWithdrawalModal } from './RecordWithdrawalModal'

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'scope', label: 'Scope & Purposes' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'audit', label: 'Audit Trails' },
]

export function ConsentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const consent = useConsentDetail(id)
  const { recordWithdrawal } = useConsentMutations()

  const [withdrawOpen, setWithdrawOpen] = useState(false)
  // Session-local toggle overrides for the Scope & Purposes tab.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})

  const activeTab = searchParams.get('tab') ?? 'overview'
  const setTab = (tab: string) => setSearchParams({ tab }, { replace: true })

  if (!consent) {
    return (
      <div className="px-6 py-5">
        <Card>
          <EmptyState
            icon={FileX2}
            title="Consent record not found"
            description="This record may have been removed or the link is invalid."
            action={<Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/consent')}>Back to records</Button>}
          />
        </Card>
      </div>
    )
  }

  const isWithdrawn = consent.status === 'Withdrawn'

  function onConfirmWithdrawal() {
    if (!id) return
    recordWithdrawal(id)
    setWithdrawOpen(false)
    toast({ tone: 'success', title: 'Consent withdrawn', description: `${id} marked as withdrawn` })
    setTab('lifecycle')
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/consent')}
            aria-label="Back to records"
            className="mt-0.5 rounded-control p-1.5 text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-fg-strong tnum">{consent.id}</h1>
              <StatusChip status={consent.status} />
            </div>
            <p className="mt-0.5 text-base text-fg-muted">
              {consent.subjectName} · {consent.subjectEmail}
            </p>
          </div>
        </div>
        <Button
          variant="danger-soft"
          disabled={isWithdrawn}
          onClick={() => setWithdrawOpen(true)}
        >
          {isWithdrawn ? 'Withdrawn' : 'Record Withdrawal'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} value={activeTab} onChange={setTab} />

      {/* Tab content */}
      <div className="pb-4">
        {activeTab === 'overview' && <OverviewTab consent={consent} />}
        {activeTab === 'scope' && (
          <ScopePurposesTab
            consent={consent}
            overrides={overrides}
            onToggle={(pid, next) => setOverrides((o) => ({ ...o, [pid]: next }))}
          />
        )}
        {activeTab === 'evidence' && <EvidenceTab consent={consent} />}
        {activeTab === 'lifecycle' && <LifecycleTab consent={consent} />}
        {activeTab === 'audit' && <AuditTrailsTab consent={consent} />}
      </div>

      <RecordWithdrawalModal
        open={withdrawOpen}
        consentId={consent.id}
        onClose={() => setWithdrawOpen(false)}
        onConfirm={onConfirmWithdrawal}
      />
    </div>
  )
}
