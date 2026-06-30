import { useFormContext } from 'react-hook-form'
import { Plus, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { StepHeading, StringSelect } from '../ropaFields'
import {
  ROPA_STEPS,
  PRIVACY_NOTICES,
  DPIA_CASES,
  SECURITY_MEASURES,
  deriveSensitive,
} from '../ropaReference'
import type { RopaFormValues } from '../ropaSchema'

const noticeLabel = (id: string) => PRIVACY_NOTICES.find((n) => n.id === id)?.label ?? id
const dpiaLabel = (id: string) => DPIA_CASES.find((d) => d.id === id)?.label ?? id

export function StepLinks() {
  const { toast } = useToast()
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[5]
  const values = watch()
  const dpiaRequired =
    deriveSensitive(values.dataCategories) ||
    values.involvesMinors ||
    values.highRiskAttestation ||
    values.transfers.length > 0

  function toggleMeasure(value: string) {
    const set = new Set(values.securityMeasures)
    set.has(value) ? set.delete(value) : set.add(value)
    setValue('securityMeasures', [...set])
  }

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="flex flex-col gap-6">
        {/* Privacy notice */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1">
              <StringSelect
                label="Privacy notice"
                value={values.privacyNoticeId}
                onChange={(v) => setValue('privacyNoticeId', v)}
                options={PRIVACY_NOTICES.map((n) => n.id)}
                placeholder="No notice linked (publish will be blocked)"
                searchPlaceholder="Search notices"
                renderValue={noticeLabel}
              />
            </div>
            <Button variant="secondary" size="md" leftIcon={Plus} onClick={() => toast({ tone: 'success', title: 'Create notice', description: 'Opens the Art. 12 notice builder' })}>
              Create notice
            </Button>
          </div>
          <p className="text-sm text-fg-muted">PDPL Art. 12 — links this activity to the notice that discloses its purpose to data subjects.</p>
        </div>

        {/* DPIA case */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1">
              <StringSelect
                label={`DPIA case${dpiaRequired ? ' (required — sensitive / minors)' : ''}`}
                required={dpiaRequired}
                value={values.dpiaCaseId}
                onChange={(v) => setValue('dpiaCaseId', v, { shouldValidate: true })}
                options={DPIA_CASES.map((d) => d.id)}
                placeholder="No DPIA linked — publish will be blocked"
                searchPlaceholder="Search DPIA cases"
                renderValue={dpiaLabel}
                error={errors.dpiaCaseId?.message}
              />
            </div>
            <Button variant="secondary" size="md" leftIcon={RefreshCw} onClick={() => toast({ tone: 'success', title: 'Refreshed', description: 'DPIA case list reloaded' })}>
              Refresh
            </Button>
            <Button variant="secondary" size="md" leftIcon={Plus} rightIcon={ExternalLink} onClick={() => toast({ tone: 'success', title: 'Create new DPIA', description: 'Opens the DPIA create page' })}>
              New DPIA
            </Button>
          </div>
          <p className="text-sm text-fg-muted">Backend's R4 gate blocks publish without a linked, published DPIA when the activity is high-risk.</p>
        </div>

        {/* Security measures */}
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-sm font-medium text-fg">Security measures (technical / organisational)</label>
            <p className="mt-0.5 text-sm text-fg-muted">The SDAIA Guide § 3 minimum-content field. Pick every control that's actually in place.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SECURITY_MEASURES.map((m) => {
              const checked = values.securityMeasures.includes(m.value)
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => toggleMeasure(m.value)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-control border px-3 py-2.5 text-left text-base transition-colors',
                    checked ? 'border-brand-200 bg-brand-50/50' : 'border-border bg-surface hover:bg-surface-sunken/50',
                  )}
                >
                  <Checkbox checked={checked} />
                  <span className="font-mono text-sm text-fg-strong">{m.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
