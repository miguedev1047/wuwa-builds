import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import { WEAPON_TYPE_IDS } from "@/modules/game-data/domain/categories"

/** URL state for the build weapon search only. */
export const useWeaponBuildFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  type: parseAsStringEnum(WEAPON_TYPE_IDS),
})
export type WeaponBuildFilters = ReturnType<
  typeof useWeaponBuildFilters
>["values"]
export type WeaponBuildFilterState = ReturnType<typeof useWeaponBuildFilters>
