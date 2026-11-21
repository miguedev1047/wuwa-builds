import { CommandSearch } from "@/components/blocks/command-search"
import { EchoBuildFilterFields } from "@build/presentation/editor/searches/echoes/components/echo-build-filters"
import { useEchoBuildResults } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-results"
import type { EchoBuildFilterState } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"
import type { EchoSelectionSummary } from "@catalog/domain/echo"
import { EchoItem } from "@catalog/presentation/components/entity-item"

/** Source-specific result rows and controls for the build echo search. */
export function EchoBuildResults({
  filters,
  selectedId,
  onSelect,
}: {
  filters: EchoBuildFilterState
  selectedId?: number | null
  onSelect: (item: EchoSelectionSummary) => void
}) {
  const { groups, sonataOptions } = useEchoBuildResults(filters.values)

  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <EchoBuildFilterFields
          filters={filters}
          sonataOptions={sonataOptions}
        />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>
          No hay ecos que coincidan con la búsqueda.
        </CommandSearch.Empty>
        {groups.map(({ cost, label, items }) => (
          <CommandSearch.Group key={cost} heading={label}>
            {items.map((item) => (
              <CommandSearch.Item
                key={item.id}
                value={String(item.id)}
                textValue={item.name}
                closeOnSelect={false}
                onSelect={() => onSelect(item)}
                subtitle={selectedId === item.id ? "Actual" : ""}
                icon={<EchoItem echo={item} />}
              >
                {item.name}
              </CommandSearch.Item>
            ))}
          </CommandSearch.Group>
        ))}
      </CommandSearch.List>
    </>
  )
}
