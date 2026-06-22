import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/data/queryKeys'
import { generateConsents, expandConsent } from '@/data/generators/consents'
import type { Consent, ConsentRow, ConsentStatus, Purpose } from '@/data/schemas'

const ROW_COUNT = 100_000

/** The full 100k dataset — generated once, cached forever. */
export function useConsents() {
  return useQuery({
    queryKey: queryKeys.consents,
    queryFn: () => generateConsents(ROW_COUNT),
  })
}

/** Read the cached rows synchronously (after the list has loaded them). */
function useConsentRows(): ConsentRow[] | undefined {
  const qc = useQueryClient()
  const { data } = useConsents()
  return data ?? qc.getQueryData<ConsentRow[]>(queryKeys.consents)
}

/** Single record expanded with purposes + audit trail for the detail page. */
export function useConsentDetail(id: string | undefined): Consent | undefined {
  const rows = useConsentRows()
  return useMemo(() => {
    if (!id || !rows) return undefined
    const row = rows.find((r) => r.id === id)
    return row ? expandConsent(row) : undefined
  }, [id, rows])
}

/**
 * Mutations operate on the Query cache so changes persist for the session.
 * Returns helpers the detail page uses for the functional interactions.
 */
export function useConsentMutations() {
  const qc = useQueryClient()

  function patchRow(id: string, patch: Partial<ConsentRow>) {
    qc.setQueryData<ConsentRow[]>(queryKeys.consents, (rows) =>
      rows?.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    )
  }

  /** Record withdrawal: flips status + sets withdrawal date. */
  function recordWithdrawal(id: string) {
    patchRow(id, { status: 'Withdrawn' as ConsentStatus, withdrawalDate: new Date().toISOString() })
  }

  return { patchRow, recordWithdrawal }
}

/**
 * Per-purpose toggle state. The toggles are session-local overrides keyed by
 * purpose id so they persist while navigating but don't require regenerating data.
 */
export function applyPurposeOverrides(
  purposes: Purpose[],
  overrides: Record<string, boolean>,
): Purpose[] {
  return purposes.map((p) => (p.id in overrides ? { ...p, consented: overrides[p.id] } : p))
}
