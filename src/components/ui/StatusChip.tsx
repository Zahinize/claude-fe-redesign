import { Badge } from './Badge'
import type { BadgeTone } from './Badge'

/** Consent record statuses (assets/features). */
export type ConsentStatus = 'Active' | 'Pending' | 'Expired' | 'Withdrawn'
/** Per-purpose consent state. */
export type PurposeState = 'Consented' | 'Declined'
/** Log/audit severity scale (assets/components/component-timeline.png + alert-colors). */
export type Severity = 'Critical' | 'High' | 'Medium' | 'Normal' | 'Low' | 'Info' | 'Debug'

const statusTone: Record<ConsentStatus, BadgeTone> = {
  Active: 'success',
  Pending: 'warning',
  Expired: 'neutral',
  Withdrawn: 'danger',
}

const purposeTone: Record<PurposeState, BadgeTone> = {
  Consented: 'success',
  Declined: 'danger',
}

export const severityTone: Record<Severity, BadgeTone> = {
  Critical: 'critical',
  High: 'danger',
  Medium: 'warning',
  Normal: 'info',
  Info: 'info',
  Low: 'neutral',
  Debug: 'neutral',
}

export function StatusChip({ status, dot = true }: { status: ConsentStatus; dot?: boolean }) {
  return (
    <Badge tone={statusTone[status]} dot={dot}>
      {status}
    </Badge>
  )
}

export function PurposeChip({ state }: { state: PurposeState }) {
  return <Badge tone={purposeTone[state]}>{state}</Badge>
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  // Critical renders solid, the rest soft — matches the log component.
  return (
    <Badge tone={severityTone[severity]} variant={severity === 'Critical' ? 'solid' : 'soft'}>
      {severity}
    </Badge>
  )
}
