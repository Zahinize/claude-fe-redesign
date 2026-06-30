import { useFormContext } from 'react-hook-form'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { Field, FieldGrid } from '@/components/ui/FieldRow'
import { cn } from '@/lib/cn'
import { StepHeading } from '../ropaFields'
import { ROPA_STEPS, ORG_PROFILE } from '../ropaReference'
import type { RopaFormValues } from '../ropaSchema'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-card py-4 last:border-b-0">
      <h4 className="mb-3 text-sm font-semibold text-fg-strong">{title}</h4>
      {children}
    </div>
  )
}

export function StepController() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[4]
  const confirmed = watch('controllerConfirmed')
  const { controller, dpo, registration } = ORG_PROFILE

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="flex flex-col gap-5">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <Block title="Controller">
            <FieldGrid columns={2}>
              <Field label="Name" value={controller.name} />
              <Field label="Address" value={controller.address} />
              <Field label="Email" value={controller.email} />
              <Field label="Phone" value={controller.phone} />
            </FieldGrid>
          </Block>
          <Block title="Data Protection Officer">
            <FieldGrid columns={2}>
              <Field label="Name" value={dpo.name} />
              <Field label="Email" value={dpo.email} />
              <Field label="Phone" value={dpo.phone} />
            </FieldGrid>
          </Block>
          <Block title="NDGP / SDAIA registration">
            <div className="flex items-center justify-between gap-3">
              <Field label="Registration ID" value={registration.id} />
              <Badge tone="success" dot>
                {registration.status}
              </Badge>
            </div>
          </Block>
        </div>

        <button
          type="button"
          onClick={() => setValue('controllerConfirmed', !confirmed, { shouldValidate: true })}
          className={cn(
            'flex items-start gap-3 rounded-card border p-4 text-left transition-colors',
            errors.controllerConfirmed ? 'border-danger-300 bg-danger-50/40' : 'border-border bg-surface hover:bg-surface-sunken/50',
          )}
        >
          <Checkbox checked={confirmed} className="mt-0.5" />
          <span className="text-base text-fg-strong">
            I confirm the controller and DPO details above are correct and apply to this activity.
          </span>
        </button>
        {errors.controllerConfirmed && (
          <p className="-mt-2 text-xs text-danger-600">{errors.controllerConfirmed.message}</p>
        )}
      </div>
    </div>
  )
}
