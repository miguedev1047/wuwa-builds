import { useSuspenseQuery } from "@tanstack/react-query"
import { characterQueries } from "@catalog/queries/characters"
import { filterResonatorBuildResults } from "@build/presentation/editor/searches/resonators/filter-resonator-build-results"
import type { ResonatorBuildFilters } from "@build/presentation/editor/searches/resonators/hooks/use-resonator-build-filters"

/** Loads and filters the build's own resonators source. */
export function useResonatorBuildResults(filters: ResonatorBuildFilters) {
  const { data } = useSuspenseQuery(characterQueries.list())
  return { items: filterResonatorBuildResults({ items: data, filters }) }
}
