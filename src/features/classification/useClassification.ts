import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/data/queryKeys'
import { generateClassificationSchemes } from '@/data/generators/classification'

/** Deterministic classification schemes — generated once, cached. */
export function useClassificationSchemes() {
  return useQuery({
    queryKey: queryKeys.classificationSchemes,
    queryFn: () => generateClassificationSchemes(21),
  })
}
