import { createSearchFilters } from "@/hooks/create-search-filters"
import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import { ECHO_CLASS_IDS } from "@/modules/game-data/domain/categories"

/** URL state for the admin echo search only. */
export const useEchoAdminFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  class: parseAsStringEnum(ECHO_CLASS_IDS),
  cost: parseAsInteger,
  sonataId: parseAsInteger,
})
export type EchoAdminFilters = ReturnType<typeof useEchoAdminFilters>["values"]
export type EchoAdminFilterState = ReturnType<typeof useEchoAdminFilters>
