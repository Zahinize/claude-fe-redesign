import { useFormContext } from 'react-hook-form'
import { Badge } from '@/components/ui/Badge'
import { StepHeading } from '../ropaFields'
import { ROPA_STEPS, PRIVACY_NOTICES, DPIA_CASES, deriveSensitive } from '../ropaReference'
import { subjectsLabel, categoriesLabel, legalBasisLabel } from '../ropaFormat'
import type { RopaFormValues } from '../ropaSchema'
import type { LegalBasis } from '@/data/schemas'

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border px-card py-3 last:border-b-0 sm:grid-cols-[14rem_1fr] sm:gap-4">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-base text-fg-strong">{children}</span>
    </div>
  )
}

export function StepReview() {
  const { watch } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[6]
  const v = watch()
  const sensitive = deriveSensitive(v.dataCategories)
  const notice = PRIVACY_NOTICES.find((n) => n.id === v.privacyNoticeId)?.label
  const dpia = DPIA_CASES.find((d) => d.id === v.dpiaCaseId)?.label

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <ReviewRow label="Name">{v.name || '—'}</ReviewRow>
        <ReviewRow label="Purpose">{v.purpose || '—'}</ReviewRow>
        <ReviewRow label="Description">{v.description || '—'}</ReviewRow>
        <ReviewRow label="Legal basis">{legalBasisLabel((v.legalBasis || null) as LegalBasis | null)}</ReviewRow>
        <ReviewRow label="Data subjects">{subjectsLabel(v.dataSubjects)}</ReviewRow>
        <ReviewRow label="Data categories">{categoriesLabel(v.dataCategories)}</ReviewRow>
        <ReviewRow label="Sensitive flag">
          {sensitive ? <Badge tone="danger">YES (derived)</Badge> : <Badge tone="neutral">No</Badge>}
        </ReviewRow>
        <ReviewRow label="Involves minors">{v.involvesMinors ? 'Yes' : 'No'}</ReviewRow>
        <ReviewRow label="High-risk attestation">{v.highRiskAttestation ? 'Yes' : 'No'}</ReviewRow>
        <ReviewRow label="Recipients">{v.recipients.length ? `${v.recipients.length} row(s)` : '—'}</ReviewRow>
        <ReviewRow label="Cross-border transfers">{v.transfers.length ? `${v.transfers.length} row(s)` : '—'}</ReviewRow>
        <ReviewRow label="Privacy notice">{notice ?? '—'}</ReviewRow>
        <ReviewRow label="DPIA case">{dpia ?? '—'}</ReviewRow>
        <ReviewRow label="Security measures">{v.securityMeasures.length ? v.securityMeasures.join(', ') : '—'}</ReviewRow>
      </div>
    </div>
  )
}
