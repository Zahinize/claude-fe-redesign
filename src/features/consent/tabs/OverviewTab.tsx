import { SectionCard } from '@/components/ui/Card'
import { Field, FieldGrid } from '@/components/ui/FieldRow'
import { PurposeChip } from '@/components/ui/StatusChip'
import { formatDateTime } from '@/lib/format'
import type { Consent } from '@/data/schemas'

export function OverviewTab({ consent }: { consent: Consent }) {
  return (
    <div className="flex flex-col gap-section-gap">
      <SectionCard title="Subject Information">
        <FieldGrid columns={2}>
          <Field label="Full Name" value={consent.subjectName} />
          <Field label="Email Address" value={consent.subjectEmail} />
          <Field label="Language" value={consent.language} />
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Consent Details">
        <FieldGrid columns={2}>
          <Field label="Consent ID" value={consent.id} />
          <Field label="Type" value={consent.type} />
          <Field label="Purpose" value={consent.purpose} />
          <Field label="Policy Version" value={consent.policyVersion} />
          <Field label="Channel" value={consent.channel} />
          <Field label="Date Given" value={formatDateTime(consent.dateGiven)} />
          <Field label="Expiry" value={formatDateTime(consent.expiryDate)} />
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Active Purposes" bodyClassName="flex flex-col gap-3">
        {consent.purposes
          .filter((p) => p.consented)
          .map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-3 rounded-card border border-border bg-surface-zebra/60 px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-fg-strong">{p.name}</span>
                  <PurposeChip state="Consented" />
                </div>
                <p className="mt-0.5 text-sm text-fg-muted">{p.description}</p>
              </div>
            </div>
          ))}
      </SectionCard>
    </div>
  )
}
