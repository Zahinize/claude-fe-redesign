import type { BadgeTone } from '@/components/ui/Badge'
import type { RopaRisk, RopaStatus } from '@/data/schemas'

export const STATUS_TONE: Record<RopaStatus, BadgeTone> = {
  Draft: 'neutral',
  'In review': 'warning',
  Approved: 'info',
  Published: 'success',
  Superseded: 'neutral',
  Archived: 'neutral',
  Retired: 'danger',
}

export const RISK_TONE: Record<RopaRisk, BadgeTone> = {
  Low: 'success',
  Medium: 'warning',
  High: 'danger',
}
