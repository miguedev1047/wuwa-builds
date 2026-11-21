import { QuerySelect } from "@/components/blocks/query-select"
import { createSearchFilters } from "@/hooks/create-search-filters"
import {
  ELEMENT_IDS,
  RARITY_OPTIONS,
  WEAPON_TYPE_IDS,
  elementSchema,
  weaponTypeSchema,
} from "@/modules/game-data/domain/categories"
import {
  ELEMENT_OPTIONS,
  WEAPON_TYPE_OPTIONS,
} from "@/modules/game-data/presentation/category-options"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"

/** URL filters for the saved resonator search. */
export const useResonatorCatalogSearchFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  element: parseAsStringEnum(ELEMENT_IDS),
  weaponType: parseAsStringEnum(WEAPON_TYPE_IDS),
})

export type ResonatorCatalogSearchFilterState = ReturnType<
  typeof useResonatorCatalogSearchFilters
>

/** Filter controls for finding saved resonators in the catalog. */
export function ResonatorCatalogSearchFilterFields({
  filters,
}: {
  filters: ResonatorCatalogSearchFilterState
}) {
  return (
    <>
      <QuerySelect
        placeholder="Filtrar por rareza"
        items={RARITY_OPTIONS}
        value={filters.values.rarity}
        onValueChange={(value) =>
          void filters.setValues({
            rarity: typeof value === "number" ? value : null,
          })
        }
      />
      <QuerySelect
        placeholder="Filtrar por elemento"
        items={ELEMENT_OPTIONS}
        value={filters.values.element}
        onValueChange={(value) =>
          void filters.setValues({
            element: elementSchema.safeParse(value).data ?? null,
          })
        }
      />
      <QuerySelect
        placeholder="Filtrar por arma"
        items={WEAPON_TYPE_OPTIONS}
        value={filters.values.weaponType}
        onValueChange={(value) =>
          void filters.setValues({
            weaponType: weaponTypeSchema.safeParse(value).data ?? null,
          })
        }
      />
    </>
  )
}
