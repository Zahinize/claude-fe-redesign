import type { LegalBasis } from '@/data/schemas'
import { subjectLabel, categoryLabel } from './ropaReference'

/** Legal basis shown lower-cased to match the register style ("contract"). */
export function legalBasisLabel(lb: LegalBasis | null): string {
  return lb ? lb.toLowerCase() : '—'
}

export function subjectsLabel(values: string[]): string {
  return values.length ? values.map(subjectLabel).join(', ') : '—'
}

export function categoriesLabel(values: string[]): string {
  return values.length ? values.map(categoryLabel).join(', ') : '—'
}
