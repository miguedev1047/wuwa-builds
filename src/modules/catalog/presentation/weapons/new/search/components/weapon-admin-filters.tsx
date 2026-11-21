import { QuerySelect } from "@/components/blocks/query-select"
import {
  RARITY_OPTIONS,
  weaponTypeSchema,
} from "@/modules/game-data/domain/categories"
import { WEAPON_TYPE_OPTIONS } from "@/modules/game-data/presentation/category-options"
import type { WeaponAdminFilterState } from "@catalog/presentation/weapons/new/search/hooks/use-weapon-admin-filters"

/** Filter controls owned by this specific search. */
export function WeaponAdminFilterFields({
  filters,
}: {
  filters: WeaponAdminFilterState
}) {
  return (
    <>
      <QuerySelect
        placeholder="Filtrar por rareza"
        items={RARITY_OPTIONS.slice(0, 3)}
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
