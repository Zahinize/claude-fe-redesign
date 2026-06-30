import { z } from 'zod'
import type { Path } from 'react-hook-form'
import { deriveSensitive } from './ropaReference'

const recipientForm = z.object({
  name: z.string(),
  scope: z.string(),
  type: z.string(),
  country: z.string(),
  vendorId: z.string(),
})

const transferForm = z.object({
  country: z.string(),
  mechanism: z.string(),
  traCase: z.string(),
})

export const ropaWizardSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    description: z.string(),
    legalBasis: z.string().min(1, 'Pick a legal basis'),
    dataSubjects: z.array(z.string()),
    involvesMinors: z.boolean(),
    highRiskAttestation: z.boolean(),
    dataCategories: z.array(z.string()),
    recipients: z.array(recipientForm),
    transfers: z.array(transferForm),
    controllerConfirmed: z
      .boolean()
      .refine((v) => v === true, 'Confirm the Controller & DPO details before continuing'),
    privacyNoticeId: z.string(),
    dpiaCaseId: z.string(),
    securityMeasures: z.array(z.string()),
  })
  .superRefine((val, ctx) => {
    const sensitive = deriveSensitive(val.dataCategories)
    const dpiaRequired =
      sensitive || val.involvesMinors || val.highRiskAttestation || val.transfers.length > 0
    if (dpiaRequired && !val.dpiaCaseId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dpiaCaseId'],
        message:
          'DPIA case link required — activity processes sensitive data, minors, has high-risk cross-border transfers, or is operator-attested high-risk',
      })
    }
  })

export type RopaFormValues = z.infer<typeof ropaWizardSchema>

export const ropaDefaults: RopaFormValues = {
  name: '',
  purpose: '',
  description: '',
  legalBasis: '',
  dataSubjects: [],
  involvesMinors: false,
  highRiskAttestation: false,
  dataCategories: [],
  recipients: [],
  transfers: [],
  controllerConfirmed: false,
  privacyNoticeId: '',
  dpiaCaseId: '',
  securityMeasures: [],
}

/** Fields validated when leaving each step (by step index). */
export const STEP_FIELDS: Path<RopaFormValues>[][] = [
  ['name', 'purpose'], // 0 basics
  ['legalBasis'], // 1 legal
  [], // 2 categories
  [], // 3 recipients
  ['controllerConfirmed'], // 4 controller
  ['dpiaCaseId'], // 5 links
  [], // 6 review
]
