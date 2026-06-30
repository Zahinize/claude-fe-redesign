import type { RopaStatus } from '@/data/schemas'

/** A preset tag option (stored as `value`; rendered as `label`). */
export interface TagOption {
  value: string
  label: string
  sensitive?: boolean
}

/** Whose data is processed (PDPL data subjects). */
export const DATA_SUBJECT_PRESETS: TagOption[] = [
  { value: 'employees', label: 'Employees' },
  { value: 'job_applicants', label: 'Job applicants' },
  { value: 'contractors_freelancers', label: 'Contractors / freelancers' },
  { value: 'customers', label: 'Customers' },
  { value: 'prospects_leads', label: 'Prospects / leads' },
  { value: 'newsletter_subscribers', label: 'Newsletter subscribers' },
  { value: 'website_visitors', label: 'Website visitors' },
  { value: 'app_users', label: 'App users' },
  { value: 'patients', label: 'Patients' },
  { value: 'suppliers', label: 'Suppliers' },
  { value: 'students', label: 'Students' },
  { value: 'beneficiaries', label: 'Beneficiaries' },
]

/**
 * Personal-data categories. `sensitive` ones (PDPL Art. 1) flip the sensitive
 * flag and gate several downstream rules (DPIA, etc.).
 */
export const DATA_CATEGORY_PRESETS: TagOption[] = [
  { value: 'full_name', label: 'Full name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address' },
  { value: 'national_id', label: 'National ID' },
  { value: 'usage_data', label: 'Usage data' },
  { value: 'location_data', label: 'Location data' },
  { value: 'device_identifiers', label: 'Device identifiers' },
  { value: 'employment_data', label: 'Employment data' },
  { value: 'financial_data', label: 'Financial data' },
  { value: 'health_data', label: 'Health data', sensitive: true },
  { value: 'ethnic_origin', label: 'Ethnic origin', sensitive: true },
  { value: 'religion_belief', label: 'Religion / belief', sensitive: true },
  { value: 'child_data', label: 'Child data', sensitive: true },
  { value: 'genetic_data', label: 'Genetic data', sensitive: true },
  { value: 'biometric_data', label: 'Biometric data', sensitive: true },
  { value: 'criminal_records', label: 'Criminal records', sensitive: true },
  { value: 'political_opinions', label: 'Political opinions', sensitive: true },
]

const SUBJECT_BY_VALUE = new Map(DATA_SUBJECT_PRESETS.map((o) => [o.value, o]))
const CATEGORY_BY_VALUE = new Map(DATA_CATEGORY_PRESETS.map((o) => [o.value, o]))

export function subjectLabel(value: string): string {
  return SUBJECT_BY_VALUE.get(value)?.label ?? value
}
export function categoryLabel(value: string): string {
  return CATEGORY_BY_VALUE.get(value)?.label ?? value
}
export function isSensitiveCategory(value: string): boolean {
  return CATEGORY_BY_VALUE.get(value)?.sensitive ?? false
}
export function isPresetSubject(value: string): boolean {
  return SUBJECT_BY_VALUE.has(value)
}
export function isPresetCategory(value: string): boolean {
  return CATEGORY_BY_VALUE.has(value)
}
/** Any selected category that is sensitive → sensitive flag. */
export function deriveSensitive(categories: string[]): boolean {
  return categories.some(isSensitiveCategory)
}

/** Recipient row type options. */
export const RECIPIENT_TYPES = ['unspecified', 'processor', 'controller', 'joint-controller', 'sub-processor']

/** Cross-border transfer mechanisms (Saudi Transfer Regulations Art. 5). */
export const TRANSFER_MECHANISMS = ['SCC', 'BCR', 'Derogation', 'Adequacy decision']

/** Security measures (SDAIA Guide § 3 minimum-content). */
export const SECURITY_MEASURES: { value: string; label: string }[] = [
  { value: 'encryption_at_rest', label: 'encryption_at_rest' },
  { value: 'encryption_in_transit', label: 'encryption_in_transit' },
  { value: 'rbac', label: 'rbac' },
  { value: 'mfa_privileged', label: 'mfa_privileged' },
  { value: 'audit_logging', label: 'audit_logging' },
  { value: 'key_management', label: 'key_management' },
  { value: 'backup_recovery', label: 'backup_recovery' },
  { value: 'retention_enforcement', label: 'retention_enforcement' },
  { value: 'secure_destruction', label: 'secure_destruction' },
]

/** Linkable Article-12 privacy notices. */
export const PRIVACY_NOTICES: { id: string; label: string }[] = [
  { id: 'pn-customer-v3', label: 'Customer Privacy Notice v3' },
  { id: 'pn-employee-v2', label: 'Employee Privacy Notice v2' },
  { id: 'pn-website-v5', label: 'Website & Cookies Notice v5' },
  { id: 'pn-patient-v1', label: 'Patient Care Privacy Notice v1' },
]

/** Linkable DPIA cases (Gate-2 publish dependency). */
export const DPIA_CASES: { id: string; label: string }[] = [
  { id: 'dpia-2026-014', label: 'DPIA-2026-014 · Sensitive data processing' },
  { id: 'dpia-2026-027', label: 'DPIA-2026-027 · Cross-border transfer' },
  { id: 'dpia-2026-031', label: 'DPIA-2026-031 · Minors processing' },
]

/** Tenant-wide Controller / DPO details (read-only in the wizard). */
export const ORG_PROFILE = {
  controller: {
    name: 'Andres Serangeli',
    address: 'King Fahd Rd, Riyadh 12345, Saudi Arabia',
    email: 'controller@demo.governata.sa',
    phone: '+966 11 200 0000',
  },
  dpo: {
    name: 'Mohammad Irfan',
    email: 'dpo@demo.governata.sa',
    phone: '+966 11 200 0002',
  },
  registration: {
    id: 'NDGP-DEMO-0001',
    status: 'registered',
  },
}

export type RopaStepId =
  | 'basics'
  | 'legal'
  | 'categories'
  | 'recipients'
  | 'controller'
  | 'links'
  | 'review'

export interface RopaStep {
  id: RopaStepId
  index: number
  label: string
  sublabel: string
  /** `Step N · <title>` heading shown above the fields. */
  title: string
  helper: string
}

export const ROPA_STEPS: RopaStep[] = [
  {
    id: 'basics',
    index: 1,
    label: 'Basics',
    sublabel: 'Name, purpose',
    title: 'Identity',
    helper: "What's this activity called and why are you doing it? Both fields are required.",
  },
  {
    id: 'legal',
    index: 2,
    label: 'Legal basis & subjects',
    sublabel: 'Lawfulness',
    title: 'Legal basis & data subjects',
    helper:
      'Pick the lawful basis under PDPL Art. 5/6. If the activity involves minors, you must use consent + capture guardian consent (PDPL Art. 7).',
  },
  {
    id: 'categories',
    index: 3,
    label: 'Data categories',
    sublabel: 'What you process',
    title: 'Data categories',
    helper:
      'List the personal-data categories you process. Sensitive categories (health, ethnic origin, religion, child data, etc.) are auto-detected and flip the sensitive-flag — which gates several downstream rules.',
  },
  {
    id: 'recipients',
    index: 4,
    label: 'Recipients & transfers',
    sublabel: 'Who gets data',
    title: 'Recipients & cross-border transfers',
    helper:
      'Who receives the data, and where does it go? You can leave both empty for now; per-row validation runs as you type.',
  },
  {
    id: 'controller',
    index: 5,
    label: 'Controller & DPO',
    sublabel: 'Section 8',
    title: 'Controller & DPO confirmation',
    helper:
      "These details are loaded from your tenant settings (Org Profile) and will be stamped on every published activity. They're tenant-wide, not per-activity.",
  },
  {
    id: 'links',
    index: 6,
    label: 'Links & security',
    sublabel: 'Notice · DPA · Controls',
    title: 'Linked records & security',
    helper:
      'Link the privacy notice that covers this activity (required for publish) and the DPIA case if the activity is high-risk. Pick the technical controls in place today.',
  },
  {
    id: 'review',
    index: 7,
    label: 'Review & save',
    sublabel: 'Final check',
    title: 'Review & save',
    helper:
      'Final preview. Click Save & Create to persist as a draft. Validation and the publish gates run later when you click Request review.',
  },
]

/** Workflow actions available from each status (detail-view action bar). */
export const STATUS_TRANSITIONS: Record<RopaStatus, { label: string; to: RopaStatus }[]> = {
  Draft: [{ label: 'Request review', to: 'In review' }],
  'In review': [
    { label: 'Approve', to: 'Approved' },
    { label: 'Reject', to: 'Draft' },
  ],
  Approved: [
    { label: 'Publish', to: 'Published' },
    { label: 'Reopen draft', to: 'Draft' },
  ],
  Published: [
    { label: 'Supersede', to: 'Superseded' },
    { label: 'Archive', to: 'Archived' },
    { label: 'Retire', to: 'Retired' },
  ],
  Superseded: [{ label: 'Archive', to: 'Archived' }],
  Archived: [],
  Retired: [],
}
