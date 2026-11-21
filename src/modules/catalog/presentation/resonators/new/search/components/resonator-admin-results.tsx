import { CommandSearch } from "@/components/blocks/command-search"
import { ResonatorAdminFilterFields } from "@catalog/presentation/resonators/new/search/components/resonator-admin-filters"
import { useResonatorAdminResults } from "@catalog/presentation/resonators/new/search/hooks/use-resonator-admin-results"
import type { ResonatorAdminFilterState } from "@catalog/presentation/resonators/new/search/hooks/use-resonator-admin-filters"
import type { EncoreCharacterSummary } from "@encore/domain/character"
import { ResonatorItem } from "@catalog/presentation/components/entity-item"

/** Source-specific result rows and controls for the admin resonator search. */
export function ResonatorAdminResults({
  filters,
  selectedId,
  onSelect,
}: {
  filters: ResonatorAdminFilterState
  selectedId?: number | null
  onSelect: (item: EncoreCharacterSummary) => void
}) {
  const { items } = useResonatorAdminResults(filters.values)
  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <ResonatorAdminFilterFields filters={filters} />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>
          No hay resonadores que coincidan con la búsqueda.
        </CommandSearch.Empty>
        <CommandSearch.Group heading="Resonadores">
          {items.map((item) => (
            <CommandSearch.Item
              key={item.id}
              value={String(item.id)}
              textValue={item.name}
              closeOnSelect={false}
              onSelect={() => onSelect(item)}
              subtitle={selectedId === item.id ? "Actual" : ""}
              icon={
                <ResonatorItem character={item} showStatus={false} compact />
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
