import { useFormContext } from 'react-hook-form'
import { Toggle } from '@/components/ui/Toggle'
import { TagSelect } from '@/components/ui/TagSelect'
import { StepHeading, StringSelect } from '../ropaFields'
import { ROPA_STEPS, DATA_SUBJECT_PRESETS } from '../ropaReference'
import { LEGAL_BASES } from '@/data/schemas'
import type { RopaFormValues } from '../ropaSchema'

function ToggleRow({
  checked,
  onChange,
  title,
  helper,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  title: string
  helper?: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-border bg-surface p-4">
      <Toggle checked={checked} onChange={onChange} label={title} />
      <div>
        <p className="text-base font-medium text-fg-strong">{title}</p>
        {helper && <p className="mt-0.5 text-sm text-fg-muted">{helper}</p>}
      </div>
    </div>
  )
}

export function StepLegal() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[1]
  const values = watch()

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="flex flex-col gap-5">
        <StringSelect
          label="Legal basis"
          required
          value={values.legalBasis}
          onChange={(v) => setValue('legalBasis', v, { shouldValidate: true })}
          options={[...LEGAL_BASES]}
          placeholder="Pick a legal basis"
          searchPlaceholder="Search legal bases"
          error={errors.legalBasis?.message}
        />

        <TagSelect
          label="Data subjects"
          helper="Whose data does this activity process? Pick from common subject types or add your own."
          value={values.dataSubjects}
          onChange={(next) => setValue('dataSubjects', next, { shouldValidate: true })}
          options={DATA_SUBJECT_PRESETS}
          placeholder="Type to search (employees, customers, …) or add your own"
        />

        <ToggleRow
          checked={values.involvesMinors}
          onChange={(v) => setValue('involvesMinors', v)}
          title="Activity processes minors or persons lacking legal capacity"
        />
        <ToggleRow
          checked={values.highRiskAttestation}
          onChange={(v) => setValue('highRiskAttestation', v)}
          title="This activity is high-risk under PDPL IR Art. 25 (attestation)"
          helper="Tick when one of the following applies: large-scale repetitive processing of persons lacking legal capacity, constant monitoring, processing based on new technologies, or automated decision-making with significant effects. Triggers the DPIA publish gate."
        />
      </div>
    </div>
  )
}
