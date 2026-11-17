import { CommandSearch } from "@/components/blocks/command-search"
import { WeaponBuildFilterFields } from "@build/presentation/editor/searches/weapons/components/weapon-build-filters"
import { useWeaponBuildResults } from "@build/presentation/editor/searches/weapons/hooks/use-weapon-build-results"
import type { WeaponBuildFilterState } from "@build/presentation/editor/searches/weapons/hooks/use-weapon-build-filters"
import type { WeaponSummary } from "@catalog/domain/weapon"
import type { WeaponTypeId } from "@/modules/game-data/domain/categories"

/** Source-specific result rows and controls for the build weapon search. */
export function WeaponBuildResults({
  filters,
  selectedId,
  onSelect,
  pending = false,
  weaponType,
}: {
  filters: WeaponBuildFilterState
  selectedId?: number | null
  onSelect: (item: WeaponSummary) => Promise<void>
  pending?: boolean
  weaponType?: WeaponTypeId
}) {
  const { items } = useWeaponBuildResults({
    filters: filters.values,
    weaponType,
  })
  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <WeaponBuildFilterFields filters={filters} />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>
          No hay armas que coincidan con la búsqueda.
        </CommandSearch.Empty>
        <CommandSearch.Group heading="Armas">
          {items.map((item) => (
            <CommandSearch.Item
              key={item.id}
              value={String(item.id)}
              textValue={item.name}
              disabled={pending}
              closeOnSelect={false}
              onSelect={() => void onSelect(item)}
              subtitle={selectedId === item.id ? "Actual" : ""}
              icon={
                <img
                  src={item.icon}
                  alt={item.name}
                  className="size-full shrink-0 rounded-sm bg-accent object-contain"
                />
              }
            >
              {item.name}
            </CommandSearch.Item>
          ))}
        </CommandSearch.Group>
      </CommandSearch.List>
    </>
  )
}
