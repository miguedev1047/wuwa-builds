import { useSuspenseQuery } from "@tanstack/react-query"
import { echoQueries } from "@catalog/queries/echoes"
import {
  filterEchoBuildResults,
  echoBuildSonataOptions,
} from "@build/presentation/editor/searches/echoes/filter-echo-build-results"
import type { EchoBuildFilters } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"

/** Loads and filters the build's own echoes source. */
export function useEchoBuildResults(filters: EchoBuildFilters) {
  const { data } = useSuspenseQuery(echoQueries.selection())
  return {
    items: filterEchoBuildResults({ items: data, filters }),
    sonataOptions: echoBuildSonataOptions(data),
  }
}
