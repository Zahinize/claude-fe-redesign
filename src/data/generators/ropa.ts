import { mulberry32, pick, randInt } from '@/lib/rng'
import type { RopaActivity } from '../schemas'
import { deriveSensitive } from '@/features/privacy/ropa/ropaReference'

const DAY = 86_400_000
const BASE = Date.UTC(2026, 5, 20)

// A small deterministic set of seed records for the register, incl. the
// screenshot's "Test 01". New activities created in the wizard are appended.
interface Seed {
  name: string
  purpose: string
  legalBasis: RopaActivity['legalBasis']
  status: RopaActivity['status']
  risk: RopaActivity['risk']
  dataSubjects: string[]
  dataCategories: string[]
}

const SEEDS: Seed[] = [
  {
    name: 'Test 01',
    purpose: 'Testing',
    legalBasis: 'Contract',
    status: 'Draft',
    risk: 'High',
    dataSubjects: ['employees'],
    dataCategories: ['ethnic_origin', 'full_name'],
  },
  {
    name: 'Payroll processing',
    purpose: 'Run monthly employee payroll and statutory reporting.',
    legalBasis: 'Legal obligation',
    status: 'Published',
    risk: 'Medium',
    dataSubjects: ['employees'],
    dataCategories: ['full_name', 'national_id', 'financial_data', 'employment_data'],
  },
  {
    name: 'Marketing email campaigns',
    purpose: 'Send product newsletters and promotional emails to subscribers.',
    legalBasis: 'Consent',
    status: 'In review',
    risk: 'Low',
    dataSubjects: ['newsletter_subscribers', 'customers'],
    dataCategories: ['full_name', 'email', 'usage_data'],
  },
  {
    name: 'Patient records management',
    purpose: 'Maintain clinical records for treatment and continuity of care.',
    legalBasis: 'Vital interests',
    status: 'Approved',
    risk: 'High',
    dataSubjects: ['patients'],
    dataCategories: ['health_data', 'genetic_data', 'full_name', 'national_id'],
  },
  {
    name: 'Website analytics',
    purpose: 'Measure website usage to improve the product experience.',
    legalBasis: 'Legitimate interests',
    status: 'Published',
    risk: 'Low',
    dataSubjects: ['website_visitors', 'app_users'],
    dataCategories: ['usage_data', 'device_identifiers', 'location_data'],
  },
]

function makeActivity(seed: Seed, i: number): RopaActivity {
  const rng = mulberry32(101 + i * 7919)
  const createdAt = BASE - randInt(rng, 5, 240) * DAY + randInt(rng, 0, 1439) * 60_000
  const updatedAt = createdAt + randInt(rng, 0, 30) * DAY
  const sensitive = deriveSensitive(seed.dataCategories)
  const id = `ropa-${String(i + 1).padStart(3, '0')}-${pick(rng, ['a1b2', 'c3d4', 'e5f6', '8g9h'])}`
  return {
    id,
    name: seed.name,
    purpose: seed.purpose,
    description: '',
    legalBasis: seed.legalBasis,
    dataSubjects: seed.dataSubjects,
    involvesMinors: false,
    highRiskAttestation: seed.risk === 'High',
    dataCategories: seed.dataCategories,
    sensitive,
    recipients: [],
    transfers: [],
    controllerConfirmed: seed.status !== 'Draft',
    privacyNoticeId: seed.status === 'Published' ? `pn-${id}` : '',
    dpiaCaseId: sensitive && seed.status !== 'Draft' ? `dpia-${id}` : '',
    securityMeasures: ['rbac', 'audit_logging', 'encryption_at_rest'],
    status: seed.status,
    risk: seed.risk,
    nextReview: seed.status === 'Published' ? new Date(updatedAt + 180 * DAY).toISOString() : null,
    createdAt: new Date(createdAt).toISOString(),
    updatedAt: new Date(updatedAt).toISOString(),
    timeline: [
      { id: `${id}-t1`, event: 'draft_started', state: 'completed', at: new Date(createdAt).toISOString() },
    ],
  }
}

export function generateRopaActivities(): RopaActivity[] {
  return SEEDS.map(makeActivity)
}
