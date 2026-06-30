import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface WizardStep {
  id: string
  label: string
  sublabel?: string
}

interface WizardStepsProps {
  steps: WizardStep[]
  /** Zero-based index of the active step. */
  current: number
  /** Navigate when a reachable (completed) step is clicked. */
  onStepClick?: (index: number) => void
}

/**
 * Horizontal numbered stepper for multi-step forms. States: completed (success
 * check), current (brand), upcoming (neutral). Completed steps are clickable.
 */
export function WizardSteps({ steps, current, onStepClick }: WizardStepsProps) {
  return (
    <ol className="flex items-start">
      {steps.map((step, i) => {
        const state = i < current ? 'completed' : i === current ? 'current' : 'upcoming'
        const clickable = state === 'completed' && onStepClick
        return (
          <li key={step.id} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(i)}
                aria-current={state === 'current' ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  state === 'completed' && 'border-success-500 bg-success-500 text-white',
                  state === 'current' && 'border-brand-600 bg-brand-50 text-brand-600',
                  state === 'upcoming' && 'border-neutral-300 bg-surface text-fg-subtle',
                  clickable && 'cursor-pointer hover:opacity-90',
                )}
              >
                {state === 'completed' ? <Check size={16} strokeWidth={3} /> : i + 1}
              </button>
              <div className="mt-2 hidden max-w-[8.5rem] flex-col items-center text-center md:flex">
                <span
                  className={cn(
                    'text-xs font-semibold leading-tight',
                    state === 'upcoming' ? 'text-fg-subtle' : 'text-fg-strong',
                  )}
                >
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className="mt-0.5 text-2xs leading-tight text-fg-subtle">{step.sublabel}</span>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 mt-4 h-0.5 flex-1 rounded-pill bg-border md:mx-3">
                <div
                  className={cn('h-full rounded-pill transition-all', i < current ? 'bg-success-500' : 'bg-transparent')}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
