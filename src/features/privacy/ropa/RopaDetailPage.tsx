import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  ShieldCheck,
  Download,
  FileX2,
  GitBranch,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionCard } from '@/components/ui/Card'
import { Field, FieldGrid } from '@/components/ui/FieldRow'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'
import { useRopaActivity, useRopaMutations } from './useRopa'
import type { RopaStatus } from '@/data/schemas'
import { STATUS_TONE, RISK_TONE } from './ropaMeta'
import { STATUS_TRANSITIONS, ORG_PROFILE, SECURITY_MEASURES } from './ropaReference'
import { subjectsLabel, categoriesLabel, legalBasisLabel } from './ropaFormat'

export function RopaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const activity = useRopaActivity(id)
  const { transitionStatus } = useRopaMutations()

  if (!activity) {
    return (
      <div className="px-6 py-5">
        <SectionCard title="Not found">
          <EmptyState
            icon={FileX2}
            title="RoPA activity not found"
            description="This record may have been removed or the link is invalid."
            action={<Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/privacy/ropa')}>Back to register</Button>}
          />
        </SectionCard>
      </div>
    )
  }

  const transitions = STATUS_TRANSITIONS[activity.status]
  const activityId = activity.id

  function runTransition(label: string, to: RopaStatus) {
    transitionStatus(activityId, to, label)
    toast({ tone: 'success', title: label, description: `Status → ${to}` })
  }

  const measureLabels = activity.securityMeasures
    .map((v) => SECURITY_MEASURES.find((m) => m.value === v)?.label ?? v)
    .join(', ')

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-5 py-5 sm:px-6">
      <Breadcrumb
        icon={ShieldCheck}
        items={[{ label: 'Data Privacy', to: '/consent' }, { label: 'RoPA', to: '/privacy/ropa' }, { label: 'Activity' }]}
      />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/privacy/ropa')}
            aria-label="Back to register"
            className="mt-0.5 rounded-control p-1.5 text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-semibold text-fg-strong">{activity.name}</h1>
              <Badge tone={STATUS_TONE[activity.status]}>{activity.status}</Badge>
              <Badge tone={RISK_TONE[activity.risk]} dot>
                {activity.risk}
              </Badge>
              {activity.sensitive && <Badge tone="warning">Sensitive</Badge>}
            </div>
            <p className="mt-0.5 text-sm text-fg-muted tnum">RoPA Activity · {activity.id}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" leftIcon={Download} onClick={() => toast({ tone: 'success', title: 'Audit pack', description: 'Download prepared' })}>
            Download audit pack
          </Button>
          <Button variant="primary" leftIcon={Pencil} onClick={() => navigate(`/privacy/ropa/${activity.id}/edit`)}>
            Edit
          </Button>
        </div>
      </div>

      {/* Workflow action bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-card border border-border bg-surface px-4 py-3">
        <span className="mr-1 text-sm font-medium text-fg-muted">Workflow</span>
        {transitions.length === 0 ? (
          <span className="text-sm text-fg-subtle">No further actions from “{activity.status}”.</span>
        ) : (
          transitions.map((t) => (
            <Button
              key={t.label}
              variant={t.label === 'Reject' ? 'danger-soft' : 'secondary'}
              size="sm"
              onClick={() => runTransition(t.label, t.to)}
            >
              {t.label}
            </Button>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_20rem]">
        {/* Left: read-only sections */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Identity">
            <FieldGrid columns={2}>
              <Field label="Name" value={activity.name} />
              <Field label="Legal basis" value={legalBasisLabel(activity.legalBasis)} />
              <Field label="Purpose" value={activity.purpose} />
              <Field label="Description" value={activity.description || '—'} />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Legal basis & data subjects">
            <FieldGrid columns={2}>
              <Field label="Data subjects" value={subjectsLabel(activity.dataSubjects)} />
              <Field label="Involves minors" value={activity.involvesMinors ? 'Yes' : 'No'} />
              <Field label="High-risk attestation" value={activity.highRiskAttestation ? 'Yes' : 'No'} />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Data categories">
            <FieldGrid columns={1}>
              <Field label="Categories" value={categoriesLabel(activity.dataCategories)} />
              <Field
                label="Sensitive-data flag"
                value={activity.sensitive ? <Badge tone="danger">YES (derived)</Badge> : <Badge tone="neutral">No</Badge>}
              />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Recipients & transfers">
            <FieldGrid columns={2}>
              <Field label="Recipients" value={activity.recipients.length ? `${activity.recipients.length} row(s)` : '—'} />
              <Field label="Cross-border transfers" value={activity.transfers.length ? `${activity.transfers.length} row(s)` : '—'} />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Controller & DPO">
            <FieldGrid columns={2}>
              <Field label="Controller" value={ORG_PROFILE.controller.name} />
              <Field label="DPO" value={ORG_PROFILE.dpo.name} />
              <Field label="Registration" value={ORG_PROFILE.registration.id} />
              <Field label="Confirmed" value={activity.controllerConfirmed ? 'Yes' : 'No'} />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Links & security">
            <FieldGrid columns={2}>
              <Field label="Privacy notice" value={activity.privacyNoticeId || '—'} />
              <Field label="DPIA case" value={activity.dpiaCaseId || '—'} />
              <Field label="Security measures" value={measureLabels || '—'} />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Metadata">
            <div className="flex flex-col gap-3">
              <Field label="Risk" value={<Badge tone={RISK_TONE[activity.risk]} dot>{activity.risk}</Badge>} />
              <Field label="Activity ID" value={<span className="break-all tnum text-sm">{activity.id}</span>} />
              <Field label="Created" value={formatDateTime(activity.createdAt)} />
              <Field label="Updated" value={formatDateTime(activity.updatedAt)} />
            </div>
          </SectionCard>

          <SectionCard title="Workflow timeline">
            <ol className="relative">
              {activity.timeline.map((e, i) => {
                const last = i === activity.timeline.length - 1
                return (
                  <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <span className="z-10 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success-50 text-success-600 ring-4 ring-surface">
                        <CheckCircle2 size={14} />
                      </span>
                      {!last && <span className="absolute top-5 h-full w-px bg-border" />}
                    </div>
                    <div>
                      <p className="text-base font-medium text-fg-strong">{e.event}</p>
                      <p className="text-xs text-fg-muted tnum">{formatDateTime(e.at)} · {e.state}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </SectionCard>

          <SectionCard title="Versions">
            <div className={cn('flex flex-col items-center gap-2 py-4 text-center')}>
              <GitBranch size={20} className="text-fg-subtle" />
              <p className="text-sm text-fg-muted">No versions found</p>
              <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'success', title: 'Version created', description: 'Snapshot saved' })}>
                Create version
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
