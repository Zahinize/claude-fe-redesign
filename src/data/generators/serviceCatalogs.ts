import { mulberry32, pick, randInt } from '@/lib/rng'
import type { Rng } from '@/lib/rng'
import type { DataAsset, ServiceCatalog } from '../schemas'

const SEED = 19

// Catalog names mirror the screenshots: business catalogs + E2E source connectors.
const CATALOGS = [
  { name: 'Clinical Records', engine: 'postgres' },
  { name: 'CRM Customer 360', engine: 'mssql' },
  { name: 'E2E Cross-DB Probe', engine: 'postgres' },
  { name: 'E2E MSSQL Source', engine: 'mssql' },
  { name: 'E2E Oracle Source', engine: 'oracle' },
  { name: 'E2E PostgreSQL Source', engine: 'postgres' },
  { name: 'Billing Warehouse', engine: 'snowflake' },
  { name: 'Identity Vault', engine: 'oracle' },
] as const

const DATASET_NOUNS = [
  'Bank_Customer',
  'Dataset Materialisation',
  'Customer Contact',
  'Query Builder Composition',
  'Account Ledger',
  'Transaction Stream',
  'Risk Profile',
  'Consent Ledger',
]
const TABLE_NAMES = ['customers', 'orders', 'invoices', 'accounts', 'events', 'shipments', 'ledger', 'profiles']

const ENGINE_META: Record<string, { host: string; connector: string; schema: string }> = {
  postgres: { host: 'internetpg: [internet_rw_db]', connector: 'E2E Harness InternetPG Source', schema: 'public' },
  mssql: { host: 'mssql01: [governata_rw]', connector: 'E2E Harness MSSQL Source', schema: 'dbo' },
  oracle: { host: 'orcl19: [GOVERNATA]', connector: 'E2E Harness Oracle Source', schema: 'governata' },
  snowflake: { host: 'sf-eu1: [ANALYTICS_WH]', connector: 'E2E Harness Snowflake Source', schema: 'analytics' },
}

function hex(rng: Rng, len = 12): string {
  const chars = '0123456789abcdef'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(rng() * 16)]
  return out
}

function makeAsset(rng: Rng, catalogId: string, engine: string, i: number): DataAsset {
  const meta = ENGINE_META[engine]
  const isTable = rng() > 0.6
  const kind = isTable ? 'Table' : 'Dataset'
  const name = isTable
    ? `${meta.schema}.${pick(rng, TABLE_NAMES)}`
    : `E2E ${pick(rng, DATASET_NOUNS)} Term ${hex(rng)}`
  const slug = isTable ? name.split('.')[1] : `qb_${hex(rng, 8)}`
  return {
    id: `${catalogId}-A${i + 1}`,
    name,
    qualifiedName: `${meta.schema}.${slug}`,
    kind,
    fields: randInt(rng, 1, 24),
    linkedColumns: randInt(rng, 2, 40),
    host: meta.host,
    connector: meta.connector,
  }
}

/** Deterministic service catalogs, each with nested datasets/tables. */
export function generateServiceCatalogs(): ServiceCatalog[] {
  return CATALOGS.map((c, ci) => {
    const rng = mulberry32(SEED + ci * 911)
    const id = `SC-${String(ci + 1).padStart(2, '0')}`
    const count = randInt(rng, 4, 12)
    const items = Array.from({ length: count }, (_, i) => makeAsset(rng, id, c.engine, i))
    return {
      id,
      name: c.name,
      datasetCount: items.filter((a) => a.kind === 'Dataset').length,
      tableCount: items.filter((a) => a.kind === 'Table').length,
      items,
    }
  })
}
