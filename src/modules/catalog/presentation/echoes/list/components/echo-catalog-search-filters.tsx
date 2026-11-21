import {
  QuerySelect,
  type QuerySelectItem,
} from "@/components/blocks/query-select"
import { createSearchFilters } from "@/hooks/create-search-filters"
import {
  ECHO_CLASS_IDS,
  ECHO_CLASS_OPTIONS,
  ECHO_COST_OPTIONS,
  echoClassSchema,
} from "@/modules/game-data/domain/categories"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"

/** URL filters for the saved echo search. */
export const useEchoCatalogSearchFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  class: parseAsStringEnum(ECHO_CLASS_IDS),
  cost: parseAsInteger,
  sonataId: parseAsInteger,
})

export type EchoCatalogSearchFilterState = ReturnType<
  typeof useEchoCatalogSearchFilters
>

/** Filter controls for finding saved echoes in the catalog. */
export function EchoCatalogSearchFilterFields({
  filters,
  sonataOptions,
}: {
  filters: EchoCatalogSearchFilterState
  sonataOptions: QuerySelectItem[]
}) {
  return (
    <>
      <QuerySelect
        placeholder="Filtrar por sonata"
        items={sonataOptions}
        value={filters.values.sonataId}
        onValueChange={(value) =>
          void filters.setValues({
            sonataId: typeof value === "number" ? value : null,
          })
        }
      />
      <QuerySelect
        placeholder="Filtrar por coste"
        items={ECHO_COST_OPTIONS}
        value={filters.values.cost}
        onValueChange={(value) =>
          void filters.setValues({
            cost: typeof value === "number" ? value : null,
          })
        }
      />
      <QuerySelect
        placeholder="Filtrar por clase"
        items={ECHO_CLASS_OPTIONS}
        value={filters.values.class}
        onValueChange={(value) =>
          void filters.setValues({
            class: echoClassSchema.safeParse(value).data ?? null,
          })
        }
      />
    </>
  )
}
