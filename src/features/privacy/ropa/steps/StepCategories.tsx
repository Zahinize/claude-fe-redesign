import { useFormContext } from 'react-hook-form'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { TagSelect } from '@/components/ui/TagSelect'
import { StepHeading } from '../ropaFields'
import { ROPA_STEPS, DATA_CATEGORY_PRESETS, deriveSensitive } from '../ropaReference'
import type { RopaFormValues } from '../ropaSchema'

export function StepCategories() {
  const { watch, setValue } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[2]
  const categories = watch('dataCategories')
  const sensitive = deriveSensitive(categories)

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="flex flex-col gap-5">
        <TagSelect
          label="Data categories"
          helper="What personal-data categories do you process? Sensitive types (PDPL Art. 1) are marked red and auto-flip the sensitive flag."
          value={categories}
          onChange={(next) => setValue('dataCategories', next, { shouldValidate: true })}
          options={DATA_CATEGORY_PRESETS}
          placeholder="Type to search (email, health_data, …) or add your own"
        />

        {/* Derived sensitive-data flag callout */}
        <div
          className={cn(
            'flex items-start gap-3 rounded-card border p-4',
            sensitive ? 'border-danger-100 bg-danger-50/60' : 'border-border bg-surface-sunken/50',
          )}
        >
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-control',
              sensitive ? 'bg-danger-100 text-danger-600' : 'bg-neutral-100 text-fg-muted',
            )}
          >
            {sensitive ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
          </span>
          <div>
            <p className="text-base font-semibold text-fg-strong">Sensitive-data flag (derived)</p>
            <p className={cn('mt-0.5 text-sm', sensitive ? 'text-danger-700' : 'text-fg-muted')}>
              {sensitive
                ? 'Sensitive — backend will set sensitive_flag=true. This gates DPIA, transfer and publish rules.'
                : 'Not sensitive — no sensitive categories selected yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
