import { mulberry32, pick, pickWeighted, randInt } from '@/lib/rng'
import type { Rng } from '@/lib/rng'
import type { AuditEntry, Consent, ConsentRow, ConsentStatus, Purpose } from '../schemas'
import {
  AUDIT_TEMPLATES,
  EMAIL_DOMAINS,
  FIRST_NAMES,
  LANGUAGES,
  LAST_NAMES,
  LEGAL_BASES,
  PURPOSES,
  USER_AGENTS,
} from './pools'

const SEED = 42
const DAY = 86_400_000
// Fixed "now" so the dataset is fully deterministic (today per project context).
const BASE = Date.UTC(2026, 5, 20)

const TYPES = ['Marketing', 'Analytics', 'Functional', 'Personalization', 'Third-Party'] as const
const CHANNELS = ['Web', 'Email', 'Mobile App', 'API', 'In-Person'] as const

// Active-heavy distribution to match the green-dominant Figma table.
const STATUS_WEIGHTS: (readonly [ConsentStatus, number])[] = [
  ['Active', 68],
  ['Pending', 14],
  ['Expired', 11],
  ['Withdrawn', 7],
]

function makeName(rng: Rng): { name: string; email: string } {
  const first = pick(rng, FIRST_NAMES)
  const last = pick(rng, LAST_NAMES)
  const domain = pick(rng, EMAIL_DOMAINS)
  const handle = `${first[0].toLowerCase()}.${last.toLowerCase()}`
  return { name: `${first} ${last}`, email: `${handle}@${domain}` }
}

function ipAddress(rng: Rng): string {
  return `${randInt(rng, 24, 220)}.${randInt(rng, 0, 255)}.${randInt(rng, 0, 255)}.${randInt(rng, 1, 254)}`
}

/** Build one flat consent row (no nested arrays — cheap for 100k). */
function makeRow(i: number): ConsentRow {
  const rng = mulberry32(SEED + i * 2654435761)
  const { name, email } = makeName(rng)
  const status = pickWeighted(rng, STATUS_WEIGHTS)
  const givenOffset = randInt(rng, 1, 720) // up to ~2 years ago
  // Add an intra-day offset so timestamps vary (not all midnight).
  const timeOfDay = randInt(rng, 0, 1439) * 60_000
  const dateGiven = BASE - givenOffset * DAY + timeOfDay
  const expiryDate = dateGiven + randInt(rng, 180, 540) * DAY
  const type = pick(rng, TYPES)
  const purpose = pick(rng, PURPOSES.filter((p) => p.type === type) ?? PURPOSES) ?? PURPOSES[0]
  const major = randInt(rng, 1, 3)
  const minor = randInt(rng, 0, 9)
  const year = new Date(dateGiven).getUTCFullYear()
  const id = `CS-${year}-${String(i + 1).padStart(4, '0')}`
  const channel = pick(rng, CHANNELS)
  const withdrawalDate =
    status === 'Withdrawn' ? new Date(expiryDate - randInt(rng, 10, 120) * DAY).toISOString() : null

  const row: ConsentRow = {
    id,
    subjectName: name,
    subjectEmail: email,
    language: pick(rng, LANGUAGES),
    type,
    purpose: purpose.name,
    status,
    version: `V${major}.${minor}`,
    policyVersion: `v${major}.${minor}`,
    dateGiven: new Date(dateGiven).toISOString(),
    expiryDate: new Date(expiryDate).toISOString(),
    channel,
    linkedActivity: `ropa-${String(randInt(rng, 1, 200)).padStart(3, '0')}`,
    captureMethod: channel,
    ipAddress: ipAddress(rng),
    userAgent: pick(rng, USER_AGENTS),
    withdrawalDate,
    _search: '',
  }
  row._search =
    `${id} ${name} ${email} ${type} ${purpose.name} ${status} ${channel} ${row.linkedActivity}`.toLowerCase()
  return row
}

/** Generate `count` deterministic consent rows. Runs once, cached by Query. */
export function generateConsents(count = 100_000): ConsentRow[] {
  const rows = new Array<ConsentRow>(count)
  for (let i = 0; i < count; i++) rows[i] = makeRow(i)
  return rows
}

/** Deterministically expand a row into purposes for the detail tabs. */
function makePurposes(row: ConsentRow, rng: Rng): Purpose[] {
  const n = randInt(rng, 3, 6)
  return Array.from({ length: n }, (_, k) => {
    const base = PURPOSES[(k + randInt(rng, 0, PURPOSES.length - 1)) % PURPOSES.length]
    return {
      id: `${row.id}-P${k + 1}`,
      name: base.name,
      description: base.description,
      legalBasis: pick(rng, LEGAL_BASES),
      type: base.type,
      // Active/Pending records mostly consented; withdrawn/expired mixed.
      consented: row.status === 'Withdrawn' ? rng() > 0.7 : rng() > 0.2,
    }
  })
}

/** Deterministically build the audit trail for the detail Audit Trails tab. */
function makeAudit(row: ConsentRow, rng: Rng): AuditEntry[] {
  const given = new Date(row.dateGiven).getTime()
  const n = randInt(rng, 4, 7)
  const entries = Array.from({ length: n }, (_, k) => {
    const t = AUDIT_TEMPLATES[(k + randInt(rng, 0, AUDIT_TEMPLATES.length - 1)) % AUDIT_TEMPLATES.length]
    return {
      id: `${row.id}-A${k + 1}`,
      severity: t.severity,
      title: t.title,
      description: t.description,
      timestamp: new Date(given + k * randInt(rng, 1, 40) * DAY).toISOString(),
    }
  })
  // newest first
  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

/** Expand a flat row into the full detail record (purposes + audit). */
export function expandConsent(row: ConsentRow): Consent {
  // Seed from the id so detail is stable per record.
  let h = 0
  for (let i = 0; i < row.id.length; i++) h = (h * 31 + row.id.charCodeAt(i)) | 0
  const rng = mulberry32(Math.abs(h) || 1)
  return {
    ...row,
    purposes: makePurposes(row, rng),
    auditTrail: makeAudit(row, rng),
  }
}
