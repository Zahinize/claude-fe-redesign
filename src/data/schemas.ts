import { z } from 'zod'

export const consentStatusSchema = z.enum(['Active', 'Pending', 'Expired', 'Withdrawn'])
export const channelSchema = z.enum(['Web', 'Email', 'Mobile App', 'API', 'In-Person'])
export const consentTypeSchema = z.enum([
  'Marketing',
  'Analytics',
  'Functional',
  'Personalization',
  'Third-Party',
])
export const severitySchema = z.enum(['Critical', 'High', 'Medium', 'Normal', 'Low'])

export const purposeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  legalBasis: z.string(),
  type: consentTypeSchema,
  consented: z.boolean(),
})

export const auditEntrySchema = z.object({
  id: z.string(),
  severity: severitySchema,
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
})

export const consentSchema = z.object({
  id: z.string(), // CS-2024-0005
  subjectName: z.string(),
  subjectEmail: z.string(),
  language: z.string(),
  type: consentTypeSchema,
  purpose: z.string(),
  status: consentStatusSchema,
  version: z.string(), // V2.1
  policyVersion: z.string(), // vv2.1
  dateGiven: z.string(), // ISO
  expiryDate: z.string(), // ISO
  channel: channelSchema,
  linkedActivity: z.string(), // ropa-007
  // evidence
  captureMethod: z.string(),
  ipAddress: z.string(),
  userAgent: z.string(),
  // lifecycle
  withdrawalDate: z.string().nullable(),
  // nested
  purposes: z.array(purposeSchema),
  auditTrail: z.array(auditEntrySchema),
  // search blob (lowercased) for fast global filtering
  _search: z.string(),
})

/** Lightweight row used in the 100k table (omits heavy nested arrays). */
export const consentRowSchema = consentSchema.omit({ purposes: true, auditTrail: true })

export type Consent = z.infer<typeof consentSchema>
export type ConsentRow = z.infer<typeof consentRowSchema>
export type Purpose = z.infer<typeof purposeSchema>
export type AuditEntry = z.infer<typeof auditEntrySchema>
export type ConsentStatus = z.infer<typeof consentStatusSchema>
export type Channel = z.infer<typeof channelSchema>
export type ConsentType = z.infer<typeof consentTypeSchema>

export const CONSENT_STATUSES = consentStatusSchema.options
export const CHANNELS = channelSchema.options
export const CONSENT_TYPES = consentTypeSchema.options
