import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Radio } from '@/components/ui/Checkbox'
import { cn } from '@/lib/cn'

const REASONS = [
  'Subject requested withdrawal',
  'Consent expired',
  'Policy no longer applicable',
  'Data minimization',
] as const

const schema = z.object({
  reason: z.enum(REASONS, { required_error: 'Select a reason for withdrawal' }),
  notes: z.string().max(280, 'Keep notes under 280 characters').optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  consentId: string
  onClose: () => void
  onConfirm: (values: FormValues) => void
}

/** Record Withdrawal confirmation — functional RHF + Zod form. */
export function RecordWithdrawalModal({ open, consentId, onClose, onConfirm }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const selectedReason = watch('reason')

  function submit(values: FormValues) {
    onConfirm(values)
    reset()
  }

  function close() {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Record Withdrawal"
      tone="negative"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            No, Cancel
          </Button>
          <Button variant="danger" loading={isSubmitting} onClick={handleSubmit(submit)}>
            Record Withdrawal
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <p className="text-base text-fg-muted">
          This will withdraw consent <span className="font-medium text-fg-strong">{consentId}</span>{' '}
          and halt all linked processing activities. This action is recorded in the audit trail.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Reason for withdrawal</span>
          <div className="flex flex-col gap-1">
            {REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setValue('reason', reason, { shouldValidate: true })}
                className={cn(
                  'flex items-center gap-3 rounded-control border px-3 py-2.5 text-left text-base transition-colors',
                  selectedReason === reason
                    ? 'border-brand-500 bg-brand-50/60'
                    : 'border-border hover:bg-surface-sunken',
                )}
              >
                <Radio checked={selectedReason === reason} />
                <span className="text-fg-strong">{reason}</span>
              </button>
            ))}
          </div>
          {errors.reason && <p className="text-xs text-danger-600">{errors.reason.message}</p>}
        </div>

        <Input
          label="Notes (optional)"
          placeholder="Add context for the audit record"
          error={errors.notes?.message}
          {...register('notes')}
        />
      </form>
    </Modal>
  )
}
