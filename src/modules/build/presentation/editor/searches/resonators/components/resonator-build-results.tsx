import { CommandSearch } from "@/components/blocks/command-search"
import { ResonatorBuildFilterFields } from "@build/presentation/editor/searches/resonators/components/resonator-build-filters"
import { useResonatorBuildResults } from "@build/presentation/editor/searches/resonators/hooks/use-resonator-build-results"
import type { ResonatorBuildFilterState } from "@build/presentation/editor/searches/resonators/hooks/use-resonator-build-filters"
import type { CharacterSummary } from "@catalog/domain/character"

/** Source-specific result rows and controls for the build resonator search. */
export function ResonatorBuildResults({
  filters,
  selectedId,
  onSelect,
  pending = false,
}: {
  filters: ResonatorBuildFilterState
  selectedId?: number | null
  onSelect: (item: CharacterSummary) => Promise<void>
  pending?: boolean
}) {
  const { items } = useResonatorBuildResults(filters.values)
  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <ResonatorBuildFilterFields filters={filters} />
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
