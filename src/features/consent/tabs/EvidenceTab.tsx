import { SectionCard } from '@/components/ui/Card'
import { Field, FieldGrid } from '@/components/ui/FieldRow'
import { formatDateTime } from '@/lib/format'
import type { Consent } from '@/data/schemas'

export function EvidenceTab({ consent }: { consent: Consent }) {
  return (
    <SectionCard title="Capture Evidence">
      <FieldGrid columns={2}>
        <Field label="Capture Method" value={consent.captureMethod} />
        <Field label="Policy Version" value={consent.policyVersion} />
        <Field label="IP Address" value={<span className="tnum">{consent.ipAddress}</span>} />
        <Field label="User Agent" value={consent.userAgent} />
        <Field label="Timestamp" value={formatDateTime(consent.dateGiven)} />
        <Field label="Language" value={consent.language} />
      </FieldGrid>
    </SectionCard>
  )
}
