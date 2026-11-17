import { QuerySelect } from "@/components/blocks/query-select"
import { RARITY_OPTIONS } from "@/modules/game-data/domain/categories"
import type { WeaponBuildFilterState } from "@build/presentation/editor/searches/weapons/hooks/use-weapon-build-filters"

/** Filter controls owned by this specific search. */
export function WeaponBuildFilterFields({
  filters,
}: {
  filters: WeaponBuildFilterState
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
    </>
  )
}
