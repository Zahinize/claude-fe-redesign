import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { Plus, Trash2, Users, Globe2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { StepHeading, StringSelect } from '../ropaFields'
import { ROPA_STEPS, RECIPIENT_TYPES, TRANSFER_MECHANISMS } from '../ropaReference'
import { RECIPIENT_SCOPES } from '@/data/schemas'
import type { RopaFormValues } from '../ropaSchema'

function SectionShell({
  title,
  caption,
  helper,
  onAdd,
  addLabel,
  children,
}: {
  title: string
  caption: string
  helper: string
  onAdd: () => void
  addLabel: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-card border border-border bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-card py-3.5">
        <div>
          <h3 className="text-base font-semibold text-fg-strong">{title}</h3>
          <p className="mt-0.5 text-sm text-fg-muted">
            <span className="font-medium text-fg">{caption}</span> — {helper}
          </p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={Plus} onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      <div className="p-card">{children}</div>
    </section>
  )
}

function RowCard({
  label,
  onRemove,
  children,
}: {
  label: string
  onRemove: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-card border border-border bg-surface-sunken/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-fg-strong">{label}</span>
        <IconButton icon={Trash2} label="Remove" size="sm" onClick={onRemove} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export function StepRecipients() {
  const { control, register } = useFormContext<RopaFormValues>()
  const step = ROPA_STEPS[3]
  const recipients = useFieldArray({ control, name: 'recipients' })
  const transfers = useFieldArray({ control, name: 'transfers' })

  return (
    <div>
      <StepHeading index={step.index} title={step.title} helper={step.helper} />
      <div className="flex flex-col gap-5">
        <SectionShell
          title="Recipients"
          caption="Section E"
          helper="List every party that receives data from this activity. Each row is one organisation; pick the scope to capture whether the share stays inside the Kingdom (PDPL Art. 15) or crosses the border."
          onAdd={() =>
            recipients.append({ name: '', scope: 'In-Kingdom', type: 'unspecified', country: '', vendorId: '' })
          }
          addLabel="Add recipient"
        >
          {recipients.fields.length === 0 ? (
            <EmptyRow icon={Users} text="No recipients added yet." />
          ) : (
            <div className="flex flex-col gap-3">
              {recipients.fields.map((field, i) => (
                <RowCard key={field.id} label={`Recipient ${i + 1}`} onRemove={() => recipients.remove(i)}>
                  <Input label="Organisation name" placeholder="e.g. Acme Processing Ltd" {...register(`recipients.${i}.name`)} />
                  <Controller
                    control={control}
                    name={`recipients.${i}.scope`}
                    render={({ field: f }) => (
                      <StringSelect label="Scope" value={f.value} onChange={f.onChange} options={[...RECIPIENT_SCOPES]} placeholder="Pick scope" />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`recipients.${i}.type`}
                    render={({ field: f }) => (
                      <StringSelect label="Recipient type" value={f.value} onChange={f.onChange} options={RECIPIENT_TYPES} placeholder="unspecified" />
                    )}
                  />
                  <Input label="Country (ISO, optional)" placeholder="e.g. SA" {...register(`recipients.${i}.country`)} />
                  <Input label="Vendor ID (optional)" placeholder="Linked vendor record" {...register(`recipients.${i}.vendorId`)} />
                </RowCard>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Cross-border transfers"
          caption="Section F"
          helper="One row per destination country. The mechanism is the legal instrument that justifies the transfer (Saudi Transfer Regulations Art. 5); link a TRA case for SCC / BCR / Derogation paths so Gate 2 can verify it."
          onAdd={() => transfers.append({ country: '', mechanism: 'SCC', traCase: '' })}
          addLabel="Add transfer"
        >
          {transfers.fields.length === 0 ? (
            <EmptyRow icon={Globe2} text="No transfers added yet." />
          ) : (
            <div className="flex flex-col gap-3">
              {transfers.fields.map((field, i) => (
                <RowCard key={field.id} label={`Transfer ${i + 1}`} onRemove={() => transfers.remove(i)}>
                  <Input label="Destination country" placeholder="e.g. United Kingdom" {...register(`transfers.${i}.country`)} />
                  <Controller
                    control={control}
                    name={`transfers.${i}.mechanism`}
                    render={({ field: f }) => (
                      <StringSelect label="Mechanism" value={f.value} onChange={f.onChange} options={TRANSFER_MECHANISMS} placeholder="Pick mechanism" />
                    )}
                  />
                  <Input label="TRA case (optional)" placeholder="Linked TRA case" {...register(`transfers.${i}.traCase`)} />
                </RowCard>
              ))}
            </div>
          )}
        </SectionShell>
      </div>
    </div>
  )
}

function EmptyRow({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-card border border-dashed border-border px-4 py-6 text-sm text-fg-muted">
      <Icon size={16} className="text-fg-subtle" />
      {text}
    </div>
  )
}
