import type { ClassificationLevel } from '@/data/schemas'

export interface SubLevel {
  level: Exclude<ClassificationLevel, 'Unclassified'>
  /** snake_case code shown under the label. */
  code: string
  /** Classification scheme this guidance belongs to. */
  scheme: string
  guidance: string
  examples: string[]
}

/**
 * Sub-level guidance shown in the per-level info modal. Top Secret & Public are
 * transcribed from the Figma screenshots; Secret & Restricted follow the same
 * NDMO register. Ordered low → high sensitivity (matches the dropdown).
 */
export const SUB_LEVELS: SubLevel[] = [
  {
    level: 'Public',
    code: 'public',
    scheme: 'NDMO',
    guidance:
      "Data shall be classified as “Public” if unauthorized access to or disclosure of such data or its content has none of the above mentioned impacts, particularly affecting: national interest; activities of entities; interests of individuals; environmental resources.",
    examples: [
      'Publicly released national strategic goals',
      'National statistics on population, environment, and businesses by industry and others',
      'Public development and economic studies',
      'Governmental procedures and policies',
      'Information on public services provided to citizens by the State',
      'Advertisements for job postings and public announcements',
      'Press releases and publicly released financial results',
      'Any information that is publicly available on the websites of any organization',
    ],
  },
  {
    level: 'Restricted',
    code: 'restricted',
    scheme: 'NDMO',
    guidance:
      "Data shall be classified as “Restricted” if unauthorized access to or disclosure of such data or its content has a limited or moderate effect on the operations of an entity, the privacy of individuals, or commercial interests, without rising to a serious or irreparable impact.",
    examples: [
      'Internal memos, operational reports, and meeting minutes',
      'Employee directory and non-sensitive HR information',
      'Non-public project documentation and roadmaps',
      'Aggregated analytics and internal dashboards',
      'Vendor and procurement records of moderate sensitivity',
    ],
  },
  {
    level: 'Secret',
    code: 'secret',
    scheme: 'NDMO',
    guidance:
      "Data shall be classified as “Secret” if unauthorized access to or disclosure of such data or its content has a serious effect on national interests, the functionality and performance of public entities, the reputation or operations of an entity, or the privacy, health, or safety of individuals.",
    examples: [
      'Financial transactions and bank account details',
      'Personally identifiable information (PII) of customers',
      'Commercial contracts, tenders, and pricing details',
      'Internal security policies and incident reports',
      'Health records and other sensitive personal data',
    ],
  },
  {
    level: 'Top Secret',
    code: 'top_secret',
    scheme: 'NDMO',
    guidance:
      "Data shall be classified as “Top Secret” if unauthorized access to or disclosure of such data or its content has an exceptionally serious and irreparable effect on the following: national interests, including violations of conventions and treaties, adverse damage to the reputation of the Kingdom, diplomatic relations and political affiliations, or the operational efficiency of security or military operations, national economy, national infrastructure or government functions; the functionality and performance of public entities, causing damage to the national interest; the health and safety of individuals at a massive scale, especially senior officials; the environmental or natural resources.",
    examples: [
      'Information on the encryption keys and mechanisms used for national infrastructure',
      'Information on terrorism crimes and plans threatening national security',
      'Information on weapons and ammunitions or strategic military locations or any source of defense or offensive force',
      'Information on the movements of armed forces or other military forces, or VPN',
      "Information that affects the State's sovereignty",
    ],
  },
]

export const SUB_LEVEL_BY_NAME = Object.fromEntries(SUB_LEVELS.map((s) => [s.level, s])) as Record<
  SubLevel['level'],
  SubLevel
>
