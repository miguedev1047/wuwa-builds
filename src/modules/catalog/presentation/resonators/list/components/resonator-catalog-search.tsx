import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { ResonatorItem } from "@catalog/presentation/components/entity-item"
import {
  ResonatorCatalogSearchFilterFields,
  useResonatorCatalogSearchFilters,
  type ResonatorCatalogSearchFilterState,
} from "@catalog/presentation/resonators/list/components/resonator-catalog-search-filters"
import { characterQueries } from "@catalog/queries/characters"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react"

type ResonatorCatalogSearchProps = {
  /** Receives the selected catalog record's ID. */
  onSelect: (id: number) => void | Promise<void>
}

/** Finds and selects a saved resonator in the catalog. */
export function ResonatorCatalogSearch({
  onSelect,
}: ResonatorCatalogSearchProps) {
  const filters = useResonatorCatalogSearchFilters({
    scope: "admin_catalog_resonators",
  })
  const [open, setOpen] = useState(false)

  const handleSelect = async (id: number) => {
    setOpen(false)
    await filters.reset()
    await onSelect(id)
  }

  return (
    <CommandSearch.Root
      trigger={
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Buscar resonador"
        >
          <HugeiconsIcon icon={Search01Icon} />
        </Button>
      }
      title="Buscar resonador"
      description="Busca por nombre o ID para abrir la ficha del catálogo."
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) void filters.reset()
      }}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
    >
      <CommandSearch.Input placeholder="Nombre o ID">
        <CommandSearch.FilterTrigger />
      </CommandSearch.Input>
      <CommandSearch.Separator />
      <Suspense fallback={<CommandSearch.Loading />}>
        <ResonatorCatalogSearchResults
          filters={filters}
          onSelect={handleSelect}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}

function ResonatorCatalogSearchResults({
  filters,
  onSelect,
}: {
  filters: ResonatorCatalogSearchFilterState
  onSelect: (id: number) => Promise<void>
}) {
  const { data } = useSuspenseQuery(characterQueries.list())
  const { rarity, element, weaponType } = filters.values
  const items = data.filter(
    (item) =>
      (rarity === null || item.rarity === rarity) &&
      (element === null || item.element === element) &&
      (weaponType === null || item.weaponType === weaponType)
  )

  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <ResonatorCatalogSearchFilterFields filters={filters} />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>
          No se encontraron resonadores.
        </CommandSearch.Empty>
        <CommandSearch.Group heading="Resonadores">
          {items.map((item) => (
            <CommandSearch.Item
              key={item.id}
              value={String(item.id)}
              textValue={item.name}
              keywords={[String(item.id)]}
              closeOnSelect={false}
              onSelect={() => void onSelect(item.id)}
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
