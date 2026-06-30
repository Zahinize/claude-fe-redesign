import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WizardSteps } from '@/components/ui/WizardSteps'
import { useToast } from '@/components/ui/Toast'
import { deriveSensitive, ROPA_STEPS } from './ropaReference'
import { ropaWizardSchema, ropaDefaults, STEP_FIELDS } from './ropaSchema'
import type { RopaFormValues } from './ropaSchema'
import { useRopaActivity, useRopaMutations } from './useRopa'
import type { LegalBasis, RopaActivity, RopaRisk } from '@/data/schemas'
import { StepBasics } from './steps/StepBasics'
import { StepLegal } from './steps/StepLegal'
import { StepCategories } from './steps/StepCategories'
import { StepRecipients } from './steps/StepRecipients'
import { StepController } from './steps/StepController'
import { StepLinks } from './steps/StepLinks'
import { StepReview } from './steps/StepReview'

const STEP_COMPONENTS = [
  StepBasics,
  StepLegal,
  StepCategories,
  StepRecipients,
  StepController,
  StepLinks,
  StepReview,
]

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(16).slice(2)
}

function deriveRisk(v: RopaFormValues, sensitive: boolean): RopaRisk {
  if (sensitive || v.involvesMinors || v.highRiskAttestation) return 'High'
  if (v.transfers.length > 0 || v.recipients.some((r) => r.scope === 'Cross-border')) return 'Medium'
  return 'Low'
}

function toForm(a: RopaActivity): RopaFormValues {
  return {
    name: a.name,
    purpose: a.purpose,
    description: a.description,
    legalBasis: a.legalBasis ?? '',
    dataSubjects: a.dataSubjects,
    involvesMinors: a.involvesMinors,
    highRiskAttestation: a.highRiskAttestation,
    dataCategories: a.dataCategories,
    recipients: a.recipients.map(({ name, scope, type, country, vendorId }) => ({ name, scope, type, country, vendorId })),
    transfers: a.transfers.map(({ country, mechanism, traCase }) => ({ country, mechanism, traCase })),
    controllerConfirmed: a.controllerConfirmed,
    privacyNoticeId: a.privacyNoticeId,
    dpiaCaseId: a.dpiaCaseId,
    securityMeasures: a.securityMeasures,
  }
}

export function RopaWizardPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)
  const existing = useRopaActivity(id)
  const { createActivity, updateActivity } = useRopaMutations()

  const [step, setStep] = useState(0)
  const methods = useForm<RopaFormValues>({
    resolver: zodResolver(ropaWizardSchema),
    defaultValues: ropaDefaults,
    mode: 'onChange',
  })
  const { handleSubmit, trigger, reset } = methods

  useEffect(() => {
    if (editing && existing) reset(toForm(existing))
  }, [editing, existing, reset])

  const isLast = step === ROPA_STEPS.length - 1
  const StepComponent = STEP_COMPONENTS[step]

  async function next() {
    const ok = await trigger(STEP_FIELDS[step])
    if (ok) setStep((s) => Math.min(s + 1, ROPA_STEPS.length - 1))
  }

  const onSave = handleSubmit((v) => {
    const now = new Date().toISOString()
    const sensitive = deriveSensitive(v.dataCategories)
    const base: RopaActivity = {
      id: editing && existing ? existing.id : uid(),
      name: v.name,
      purpose: v.purpose,
      description: v.description,
      legalBasis: (v.legalBasis || null) as LegalBasis | null,
      dataSubjects: v.dataSubjects,
      involvesMinors: v.involvesMinors,
      highRiskAttestation: v.highRiskAttestation,
      dataCategories: v.dataCategories,
      sensitive,
      recipients: v.recipients.map((r) => ({ ...r, id: uid(), scope: r.scope as RopaActivity['recipients'][number]['scope'] })),
      transfers: v.transfers.map((t) => ({ ...t, id: uid() })),
      controllerConfirmed: v.controllerConfirmed,
      privacyNoticeId: v.privacyNoticeId,
      dpiaCaseId: v.dpiaCaseId,
      securityMeasures: v.securityMeasures,
      status: editing && existing ? existing.status : 'Draft',
      risk: deriveRisk(v, sensitive),
      nextReview: editing && existing ? existing.nextReview : null,
      createdAt: editing && existing ? existing.createdAt : now,
      updatedAt: now,
      timeline:
        editing && existing
          ? existing.timeline
          : [{ id: uid(), event: 'draft_started', state: 'completed', at: now }],
    }
    if (editing) {
      updateActivity(base)
      toast({ tone: 'success', title: 'Activity updated', description: base.name })
    } else {
      createActivity(base)
      toast({ tone: 'success', title: 'RoPA activity created', description: base.name })
    }
    navigate(`/privacy/ropa/${base.id}`)
  })

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-full flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 border-b border-border bg-surface-muted/90 px-5 py-3 backdrop-blur sm:px-6">
          <button
            onClick={() => navigate('/privacy/ropa')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={16} /> Back to register
          </button>
        </div>

        <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 sm:px-6">
          <h1 className="text-xl font-semibold text-fg-strong">
            {editing ? 'Edit RoPA Activity' : 'Create RoPA Activity'}
          </h1>

          {/* Stepper */}
          <div className="sticky top-[3.25rem] z-10 mt-5 rounded-card border border-border bg-surface px-5 py-4 shadow-card">
            <WizardSteps
              steps={ROPA_STEPS.map((s) => ({ id: s.id, label: s.label, sublabel: s.sublabel }))}
              current={step}
              onStepClick={setStep}
            />
          </div>

          {/* Step content */}
          <div className="mt-5 rounded-card border border-border bg-surface p-6 shadow-card">
            <StepComponent />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-5 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
            <Button variant="secondary" leftIcon={ChevronLeft} disabled={step === 0} onClick={() => setStep((s) => Math.max(s - 1, 0))}>
              Previous
            </Button>
            <span className="text-sm font-medium text-fg-muted">
              Step {step + 1} / {ROPA_STEPS.length}
            </span>
            {isLast ? (
              <Button variant="primary" leftIcon={Check} onClick={onSave}>
                {editing ? 'Save changes' : 'Save & Create'}
              </Button>
            ) : (
              <Button variant="primary" rightIcon={ChevronRight} onClick={next}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
