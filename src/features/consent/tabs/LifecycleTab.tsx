import { SectionCard } from '@/components/ui/Card'
import { FieldTimeline } from '@/components/timeline/FieldTimeline'
import { formatDate } from '@/lib/format'
import type { Consent } from '@/data/schemas'

export function LifecycleTab({ consent }: { consent: Consent }) {
  return (
    <SectionCard title="Lifecycle">
      <FieldTimeline
        items={[
          { label: 'Date Given', value: formatDate(consent.dateGiven) },
          { label: 'Policy Version', value: consent.policyVersion },
          { label: 'Expiry Date', value: formatDate(consent.expiryDate) },
          {
            label: 'Withdrawal Date',
            value: consent.withdrawalDate ? formatDate(consent.withdrawalDate) : 'Not Withdrawn',
            muted: !consent.withdrawalDate,
          },
        ]}
      />
    </SectionCard>
  )
}
