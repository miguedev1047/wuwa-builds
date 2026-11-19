import { CommandSearch } from "@/components/blocks/command-search"
import { WeaponAdminFilterFields } from "@catalog/presentation/searches/weapons/components/weapon-admin-filters"
import { useWeaponAdminResults } from "@catalog/presentation/searches/weapons/hooks/use-weapon-admin-results"
import type { WeaponAdminFilterState } from "@catalog/presentation/searches/weapons/hooks/use-weapon-admin-filters"
import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import { WeaponItem } from "@catalog/presentation/components/entity-item"

/** Source-specific result rows and controls for the admin weapon search. */
export function WeaponAdminResults({
  filters,
  selectedId,
  onSelect,
}: {
  filters: WeaponAdminFilterState
  selectedId?: number | null
  onSelect: (item: EncoreWeaponSummary) => void
}) {
  const { items } = useWeaponAdminResults(filters.values)
  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <WeaponAdminFilterFields filters={filters} />
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
              closeOnSelect={false}
              onSelect={() => onSelect(item)}
              subtitle={selectedId === item.id ? "Actual" : ""}
              icon={<WeaponItem weapon={item} showStatus={false} />}
            >
              {item.name}
            </CommandSearch.Item>
          ))}
        </CommandSearch.Group>
      </CommandSearch.List>
    </>
  )
}
