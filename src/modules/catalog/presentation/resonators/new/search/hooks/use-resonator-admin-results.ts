import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { filterResonatorAdminResults } from "@catalog/presentation/resonators/new/search/filter-resonator-admin-results"
import type { ResonatorAdminFilters } from "@catalog/presentation/resonators/new/search/hooks/use-resonator-admin-filters"

/** Loads and filters the admin's own resonators source. */
export function useResonatorAdminResults(filters: ResonatorAdminFilters) {
  const { data } = useSuspenseQuery(encoreCharacterQueries.list())
  return { items: filterResonatorAdminResults({ items: data, filters }) }
}
