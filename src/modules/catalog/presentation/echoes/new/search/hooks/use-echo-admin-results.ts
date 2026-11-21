import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreEchoQueries } from "@encore/queries/catalogs"
import {
  filterEchoAdminResults,
  echoAdminSonataOptions,
} from "@catalog/presentation/echoes/new/search/filter-echo-admin-results"
import type { EchoAdminFilters } from "@catalog/presentation/echoes/new/search/hooks/use-echo-admin-filters"

/** Loads and filters the admin's own echoes source. */
export function useEchoAdminResults(filters: EchoAdminFilters) {
  const { data } = useSuspenseQuery(encoreEchoQueries.list())
  return {
    items: filterEchoAdminResults({ items: data, filters }),
    sonataOptions: echoAdminSonataOptions(data),
  }
}
