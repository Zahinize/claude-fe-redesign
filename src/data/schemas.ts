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

/* -------------------- Data Classification -------------------- */

export const classificationLevelSchema = z.enum([
  'Top Secret',
  'Secret',
  'Restricted',
  'Public',
  'Unclassified',
])
export const schemeKindSchema = z.enum(['Dataset', 'Table'])
export const classificationMethodSchema = z.enum(['direct', 'linked', 'inherited'])

export const classificationSchemeSchema = z.object({
  id: z.string(), // DCS-0001
  index: z.number(), // #1
  kind: schemeKindSchema,
  title: z.string(),
  description: z.string(),
  classification: classificationLevelSchema,
  method: classificationMethodSchema,
  fields: z.number(),
  mappedColumns: z.number(),
  columns: z.number(),
  source: z.string(),
  domain: z.string(),
  serviceCatalog: z.string(),
  updatedAt: z.string(),
})

export type ClassificationScheme = z.infer<typeof classificationSchemeSchema>
export type ClassificationLevel = z.infer<typeof classificationLevelSchema>
export type SchemeKind = z.infer<typeof schemeKindSchema>
export type ClassificationMethod = z.infer<typeof classificationMethodSchema>

export const CLASSIFICATION_LEVELS = classificationLevelSchema.options

/* -------------------- Classify-data flow (catalogs / assets) -------------------- */

export const dataAssetSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g. "E2E Bank_Customer Term cde9b217b04b"
  qualifiedName: z.string(), // e.g. "public.qb_edge_term"
  kind: schemeKindSchema, // Dataset | Table
  fields: z.number(),
  linkedColumns: z.number(),
  host: z.string(), // "internetpg: [internet_rw_db]"
  connector: z.string(), // "E2E Harness InternetPG Source"
})

export const serviceCatalogSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g. "E2E PostgreSQL Source"
  datasetCount: z.number(),
  tableCount: z.number(),
  items: z.array(dataAssetSchema),
})

export type DataAsset = z.infer<typeof dataAssetSchema>
export type ServiceCatalog = z.infer<typeof serviceCatalogSchema>

/* -------------------- RoPA (Records of Processing Activities) -------------------- */

export const ropaStatusSchema = z.enum([
  'Draft',
  'In review',
  'Approved',
  'Published',
  'Superseded',
  'Archived',
  'Retired',
])
export const ropaRiskSchema = z.enum(['Low', 'Medium', 'High'])
export const legalBasisSchema = z.enum([
  'Consent',
  'Contract',
  'Legal obligation',
  'Vital interests',
  'Public task',
  'Legitimate interests',
])
export const recipientScopeSchema = z.enum(['In-Kingdom', 'Cross-border'])

export const recipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  scope: recipientScopeSchema,
  type: z.string(), // "unspecified" | processor | controller | ...
  country: z.string(), // ISO, optional
  vendorId: z.string(),
})

export const transferSchema = z.object({
  id: z.string(),
  country: z.string(),
  mechanism: z.string(), // SCC | BCR | Derogation | Adequacy
  traCase: z.string(),
})

export const ropaActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.string(),
  description: z.string(),
  legalBasis: legalBasisSchema.nullable(),
  dataSubjects: z.array(z.string()), // codes; custom values derived when not a preset
  involvesMinors: z.boolean(),
  highRiskAttestation: z.boolean(),
  dataCategories: z.array(z.string()),
  sensitive: z.boolean(), // derived from sensitive categories
  recipients: z.array(recipientSchema),
  transfers: z.array(transferSchema),
  controllerConfirmed: z.boolean(),
  privacyNoticeId: z.string(),
  dpiaCaseId: z.string(),
  securityMeasures: z.array(z.string()),
  status: ropaStatusSchema,
  risk: ropaRiskSchema,
  nextReview: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  timeline: z.array(
    z.object({ id: z.string(), event: z.string(), state: z.string(), at: z.string() }),
  ),
})

export type RopaActivity = z.infer<typeof ropaActivitySchema>
export type RopaStatus = z.infer<typeof ropaStatusSchema>
export type RopaRisk = z.infer<typeof ropaRiskSchema>
export type LegalBasis = z.infer<typeof legalBasisSchema>
export type Recipient = z.infer<typeof recipientSchema>
export type Transfer = z.infer<typeof transferSchema>
export type RopaTimelineEvent = RopaActivity['timeline'][number]

export const ROPA_STATUSES = ropaStatusSchema.options
export const ROPA_RISKS = ropaRiskSchema.options
export const LEGAL_BASES = legalBasisSchema.options
export const RECIPIENT_SCOPES = recipientScopeSchema.options
