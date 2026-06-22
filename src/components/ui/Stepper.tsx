import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface Step {
  label: string
}

type StepState = 'completed' | 'current' | 'upcoming'

/** Vertical stepper (assets/components/component-onboarding-stepper.png). */
export function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const state: StepState = i < current ? 'completed' : i === current ? 'current' : 'upcoming'
        return (
          <li key={step.label} className="flex items-center gap-3 py-1.5">
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border-2 text-2xs font-semibold',
                state === 'completed' && 'border-success-500 bg-success-500 text-white',
                state === 'current' && 'border-brand-600 text-brand-600',
                state === 'upcoming' && 'border-neutral-300 text-fg-subtle',
              )}
            >
              {state === 'completed' ? (
                <Check size={12} strokeWidth={3} />
              ) : state === 'current' ? (
                <span className="h-2 w-2 rounded-full bg-brand-600" />
              ) : null}
            </span>
            <span
              className={cn(
                'text-base',
                state === 'upcoming' ? 'text-fg-subtle' : 'font-medium text-fg-strong',
              )}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
