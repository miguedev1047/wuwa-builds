import { CommandSearch } from "@/components/blocks/command-search"
import { EchoAdminFilterFields } from "@catalog/presentation/searches/echoes/components/echo-admin-filters"
import { useEchoAdminResults } from "@catalog/presentation/searches/echoes/hooks/use-echo-admin-results"
import type { EchoAdminFilterState } from "@catalog/presentation/searches/echoes/hooks/use-echo-admin-filters"
import type { EncoreEchoSummary } from "@encore/domain/echo"
import { EchoItem } from "@catalog/presentation/components/entity-item"

/** Source-specific result rows and controls for the admin echo search. */
export function EchoAdminResults({
  filters,
  selectedId,
  onSelect,
}: {
  filters: EchoAdminFilterState
  selectedId?: number | null
  onSelect: (item: EncoreEchoSummary) => void
}) {
  const { items, sonataOptions } = useEchoAdminResults(filters.values)
  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <EchoAdminFilterFields
          filters={filters}
          sonataOptions={sonataOptions}
        />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>
          No hay ecos que coincidan con la búsqueda.
        </CommandSearch.Empty>
        <CommandSearch.Group heading="Ecos">
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
      </CommandSearch.List>
    </>
  )
}
