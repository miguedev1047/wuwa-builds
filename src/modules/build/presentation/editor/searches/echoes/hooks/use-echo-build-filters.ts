import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import { ECHO_CLASS_IDS } from "@/modules/game-data/domain/categories"

/** URL state for the build echo search only. */
export const useEchoBuildFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  class: parseAsStringEnum(ECHO_CLASS_IDS),
  cost: parseAsInteger,
  sonataId: parseAsInteger,
})
export type EchoBuildFilters = ReturnType<typeof useEchoBuildFilters>["values"]
export type EchoBuildFilterState = ReturnType<typeof useEchoBuildFilters>
