import { QuerySelect } from "@/components/blocks/query-select"
import { createSearchFilters } from "@/hooks/create-search-filters"
import {
  RARITY_OPTIONS,
  WEAPON_TYPE_IDS,
  weaponTypeSchema,
} from "@/modules/game-data/domain/categories"
import { WEAPON_TYPE_OPTIONS } from "@/modules/game-data/presentation/category-options"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"

/** URL filters for the saved weapon search. */
export const useWeaponCatalogSearchFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
  rarity: parseAsInteger,
  type: parseAsStringEnum(WEAPON_TYPE_IDS),
})

export type WeaponCatalogSearchFilterState = ReturnType<
  typeof useWeaponCatalogSearchFilters
>

/** Filter controls for finding saved weapons in the catalog. */
export function WeaponCatalogSearchFilterFields({
  filters,
}: {
  filters: WeaponCatalogSearchFilterState
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
        placeholder="Filtrar por tipo"
        items={WEAPON_TYPE_OPTIONS}
        value={filters.values.type}
        onValueChange={(value) =>
          void filters.setValues({
            type: weaponTypeSchema.safeParse(value).data ?? null,
          })
        }
      />
    </>
  )
}
