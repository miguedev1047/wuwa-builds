import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import {
  ELEMENT_IDS,
  WEAPON_TYPE_IDS,
} from "@/modules/game-data/domain/categories"

/** URL state for the build resonator search only. */
export const useResonatorBuildFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  element: parseAsStringEnum(ELEMENT_IDS),
  weaponType: parseAsStringEnum(WEAPON_TYPE_IDS),
})
export type ResonatorBuildFilters = ReturnType<
  typeof useResonatorBuildFilters
>["values"]
export type ResonatorBuildFilterState = ReturnType<
  typeof useResonatorBuildFilters
>
