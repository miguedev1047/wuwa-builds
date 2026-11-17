import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { filterWeaponAdminResults } from "@catalog/presentation/searches/weapons/filter-weapon-admin-results"
import type { WeaponAdminFilters } from "@catalog/presentation/searches/weapons/hooks/use-weapon-admin-filters"

/** Loads and filters the admin's own weapons source. */
export function useWeaponAdminResults(filters: WeaponAdminFilters) {
  const { data } = useSuspenseQuery(encoreWeaponQueries.list())
  return { items: filterWeaponAdminResults({ items: data, filters }) }
}
