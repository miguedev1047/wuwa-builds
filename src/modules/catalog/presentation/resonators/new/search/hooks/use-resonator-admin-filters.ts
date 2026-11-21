import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import {
  ELEMENT_IDS,
  WEAPON_TYPE_IDS,
} from "@/modules/game-data/domain/categories"

/** URL state for the admin resonator search only. */
export const useResonatorAdminFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  element: parseAsStringEnum(ELEMENT_IDS),
  weaponType: parseAsStringEnum(WEAPON_TYPE_IDS),
})
export type ResonatorAdminFilters = ReturnType<
  typeof useResonatorAdminFilters
>["values"]
export type ResonatorAdminFilterState = ReturnType<
  typeof useResonatorAdminFilters
>
