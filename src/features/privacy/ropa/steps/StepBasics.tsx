import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { StepHeading } from '../ropaFields'
import { ROPA_STEPS } from '../ropaReference'
import type { RopaFormValues } from '../ropaSchema'

export function StepBasics() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[0]

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="flex flex-col gap-5">
        <Input
          label="Activity name"
          required
          placeholder="e.g. Customer onboarding"
          error={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="Purpose"
          required
          rows={3}
          placeholder="Why are you processing this data?"
          error={errors.purpose?.message}
          {...register('purpose')}
        />
        <Textarea
          label="Description"
          rows={3}
          placeholder="Optional context for reviewers"
          hint="Optional"
          {...register('description')}
        />
      </div>
    </div>
  )
}
