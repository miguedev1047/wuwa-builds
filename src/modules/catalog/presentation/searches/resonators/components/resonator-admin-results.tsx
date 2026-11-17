import { CommandSearch } from "@/components/blocks/command-search"
import { ResonatorAdminFilterFields } from "@catalog/presentation/searches/resonators/components/resonator-admin-filters"
import { useResonatorAdminResults } from "@catalog/presentation/searches/resonators/hooks/use-resonator-admin-results"
import type { ResonatorAdminFilterState } from "@catalog/presentation/searches/resonators/hooks/use-resonator-admin-filters"
import type { EncoreCharacterSummary } from "@encore/domain/character"

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
