import { QuerySelect } from "@/components/blocks/query-select"
import {
  RARITY_OPTIONS,
  elementSchema,
  weaponTypeSchema,
} from "@/modules/game-data/domain/categories"
import {
  ELEMENT_OPTIONS,
  WEAPON_TYPE_OPTIONS,
} from "@/modules/game-data/presentation/category-options"
import type { ResonatorAdminFilterState } from "@catalog/presentation/resonators/new/search/hooks/use-resonator-admin-filters"

/** Filter controls owned by this specific search. */
export function ResonatorAdminFilterFields({
  filters,
}: {
  filters: ResonatorAdminFilterState
}) {
  return (
    <>
      <QuerySelect
        placeholder="Filtrar por rareza"
        items={RARITY_OPTIONS.slice(0, 2)}
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
