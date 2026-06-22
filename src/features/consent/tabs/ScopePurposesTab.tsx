import { SectionCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import type { Consent } from '@/data/schemas'

interface Props {
  consent: Consent
  /** Session-local toggle overrides keyed by purpose id. */
  overrides: Record<string, boolean>
  onToggle: (purposeId: string, next: boolean) => void
}

export function ScopePurposesTab({ consent, overrides, onToggle }: Props) {
  return (
    <SectionCard title="Consent Scope — Purposes" bodyClassName="flex flex-col gap-3">
      {consent.purposes.map((p) => {
        const checked = p.id in overrides ? overrides[p.id] : p.consented
        return (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-card border border-border bg-surface-zebra/50 px-4 py-3.5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-fg-strong">{p.name}</span>
                <Badge tone="brand">{p.type}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-fg-muted">{p.description}</p>
              <p className="mt-1 text-xs text-fg-subtle">Legal Basis: {p.legalBasis}</p>
            </div>
            <Toggle
              checked={checked}
              onChange={(next) => onToggle(p.id, next)}
              label={`Toggle ${p.name}`}
            />
          </div>
        )
      })}
    </SectionCard>
  )
}
