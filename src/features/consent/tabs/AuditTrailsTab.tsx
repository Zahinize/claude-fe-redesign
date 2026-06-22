import { SectionCard } from '@/components/ui/Card'
import { LogTimeline } from '@/components/timeline/LogTimeline'
import type { LogEntry } from '@/components/timeline/LogTimeline'
import type { Consent } from '@/data/schemas'

export function AuditTrailsTab({ consent }: { consent: Consent }) {
  const entries: LogEntry[] = consent.auditTrail.map((a) => ({
    id: a.id,
    severity: a.severity,
    title: a.title,
    description: a.description,
    timestamp: a.timestamp,
  }))
  return (
    <SectionCard title="Audit Trail">
      <LogTimeline entries={entries} />
    </SectionCard>
  )
}
