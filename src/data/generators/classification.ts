import { mulberry32, pick, pickWeighted, randInt } from '@/lib/rng'
import type { Rng } from '@/lib/rng'
import type {
  ClassificationLevel,
  ClassificationMethod,
  ClassificationScheme,
  SchemeKind,
} from '../schemas'

const SEED = 7
const DAY = 86_400_000
const BASE = Date.UTC(2026, 5, 20)

const SOURCES = ['MSSQL', 'Oracle', 'Postgres', 'Snowflake', 'BigQuery'] as const
const DOMAINS = ['Finance', 'Human Resources', 'Marketing', 'Operations', 'Engineering', 'Legal']
const CATALOGS = ['Customer 360', 'Risk & Compliance', 'Billing', 'Analytics', 'Identity']
const CONNECTORS = ['free', 'standard', 'enterprise']

// Distribution leans toward classified records so the grid reads richly, with a
// realistic minority Unclassified. Summary stats are derived from this.
const LEVEL_WEIGHTS: (readonly [ClassificationLevel, number])[] = [
  ['Top Secret', 14],
  ['Secret', 22],
  ['Restricted', 24],
  ['Public', 26],
  ['Unclassified', 14],
]

const METHOD_WEIGHTS: (readonly [ClassificationMethod, number])[] = [
  ['direct', 50],
  ['linked', 32],
  ['inherited', 18],
]

function hex(rng: Rng, len = 12): string {
  const chars = '0123456789abcdef'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(rng() * 16)]
  return out
}

function makeScheme(i: number): ClassificationScheme {
  const rng = mulberry32(SEED + i * 2654435761)
  const kind: SchemeKind = rng() > 0.65 ? 'Table' : 'Dataset'
  const source = pick(rng, SOURCES)
  const token = hex(rng)
  const fields = randInt(rng, 6, 48)
  const columns = randInt(rng, 4, 40)

  const title =
    kind === 'Dataset'
      ? `E2E ${source} Query Builder Composition Term ${token}`
      : `GOVERNATA_TEST.${pick(rng, ['CUSTOMERS', 'ORDERS', 'INVOICES', 'ACCOUNTS', 'EVENTS', 'SHIPMENTS'])}`

  const description =
    kind === 'Dataset'
      ? `${source} composition evaluator proof Term ${token}`
      : `E2E ${source} Source · Connector ${hex(rng, 8)} · ${source.toLowerCase()} · ${pick(rng, CONNECTORS).toUpperCase()}`

  return {
    id: `DCS-${String(i + 1).padStart(4, '0')}`,
    index: i + 1,
    kind,
    title,
    description,
    classification: pickWeighted(rng, LEVEL_WEIGHTS),
    method: pickWeighted(rng, METHOD_WEIGHTS),
    fields,
    mappedColumns: Math.min(fields + randInt(rng, 0, 20), 64),
    columns,
    source: `E2E ${source} Source`,
    domain: pick(rng, DOMAINS),
    serviceCatalog: pick(rng, CATALOGS),
    updatedAt: new Date(BASE - randInt(rng, 1, 300) * DAY + randInt(rng, 0, 1439) * 60_000).toISOString(),
  }
}

/** Generate the deterministic set of classification schemes. */
export function generateClassificationSchemes(count = 21): ClassificationScheme[] {
  return Array.from({ length: count }, (_, i) => makeScheme(i))
}

export interface ClassificationSummary {
  total: number
  /** Items that carry a top-level classification scheme (i.e. not Unclassified). */
  classified: number
  byLevel: Record<Exclude<ClassificationLevel, 'Unclassified'>, number>
}

export function summarize(schemes: ClassificationScheme[]): ClassificationSummary {
  const byLevel = { 'Top Secret': 0, Secret: 0, Restricted: 0, Public: 0 } as ClassificationSummary['byLevel']
  let classified = 0
  for (const s of schemes) {
    if (s.classification !== 'Unclassified') {
      classified++
      byLevel[s.classification] += 1
    }
  }
  return { total: schemes.length, classified, byLevel }
}
