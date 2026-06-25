import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/data/queryKeys'
import { generateClassificationSchemes } from '@/data/generators/classification'
import { generateServiceCatalogs } from '@/data/generators/serviceCatalogs'

/** Deterministic classification schemes — generated once, cached. */
export function useClassificationSchemes() {
  return useQuery({
    queryKey: queryKeys.classificationSchemes,
    queryFn: () => generateClassificationSchemes(21),
  })
}

/** Service catalogs + their datasets/tables for the Classify Data flow. */
export function useServiceCatalogs() {
  return useQuery({
    queryKey: queryKeys.serviceCatalogs,
    queryFn: () => generateServiceCatalogs(),
  })
}
