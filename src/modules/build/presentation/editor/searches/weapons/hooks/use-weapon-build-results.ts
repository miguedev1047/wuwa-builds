import { useSuspenseQuery } from "@tanstack/react-query"
import { weaponQueries } from "@catalog/queries/weapons"
import { filterWeaponBuildResults } from "@build/presentation/editor/searches/weapons/filter-weapon-build-results"
import type { WeaponBuildFilters } from "@build/presentation/editor/searches/weapons/hooks/use-weapon-build-filters"
import type { WeaponTypeId } from "@/modules/game-data/domain/categories"

/** Loads and filters the build's own weapons source. */
export function useWeaponBuildResults({
  filters,
  weaponType,
}: {
  filters: WeaponBuildFilters
  weaponType?: WeaponTypeId
}) {
  const { data } = useSuspenseQuery(weaponQueries.list())
  return {
    items: filterWeaponBuildResults({ items: data, filters, weaponType }),
  }
}
