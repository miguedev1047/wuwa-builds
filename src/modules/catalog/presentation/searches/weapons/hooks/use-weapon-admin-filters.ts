import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import { WEAPON_TYPE_IDS } from "@/modules/game-data/domain/categories"

/** URL state for the admin weapon search only. */
export const useWeaponAdminFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  type: parseAsStringEnum(WEAPON_TYPE_IDS),
})
export type WeaponAdminFilters = ReturnType<
  typeof useWeaponAdminFilters
>["values"]
export type WeaponAdminFilterState = ReturnType<typeof useWeaponAdminFilters>
