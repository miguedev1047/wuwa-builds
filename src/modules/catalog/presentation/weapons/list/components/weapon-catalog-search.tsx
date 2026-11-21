import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { WeaponItem } from "@catalog/presentation/components/entity-item"
import {
  WeaponCatalogSearchFilterFields,
  useWeaponCatalogSearchFilters,
  type WeaponCatalogSearchFilterState,
} from "@catalog/presentation/weapons/list/components/weapon-catalog-search-filters"
import { weaponQueries } from "@catalog/queries/weapons"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react"

type WeaponCatalogSearchProps = {
  /** Receives the selected catalog record's ID. */
  onSelect: (id: number) => void | Promise<void>
}

/** Finds and selects a saved weapon in the catalog. */
export function WeaponCatalogSearch({ onSelect }: WeaponCatalogSearchProps) {
  const filters = useWeaponCatalogSearchFilters({
    scope: "admin_catalog_weapons",
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
          aria-label="Buscar arma"
        >
          <HugeiconsIcon icon={Search01Icon} />
        </Button>
      }
      title="Buscar arma"
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
        <WeaponCatalogSearchResults filters={filters} onSelect={handleSelect} />
      </Suspense>
    </CommandSearch.Root>
  )
}

function WeaponCatalogSearchResults({
  filters,
  onSelect,
}: {
  filters: WeaponCatalogSearchFilterState
  onSelect: (id: number) => Promise<void>
}) {
  const { data } = useSuspenseQuery(weaponQueries.list())
  const { rarity, type } = filters.values
  const items = data.filter(
    (item) =>
      (rarity === null || item.rarity === rarity) &&
      (type === null || item.type === type)
  )

  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <WeaponCatalogSearchFilterFields filters={filters} />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>No se encontraron armas.</CommandSearch.Empty>
        <CommandSearch.Group heading="Armas">
          {items.map((item) => (
            <CommandSearch.Item
              key={item.id}
              value={String(item.id)}
              textValue={item.name}
              keywords={[String(item.id)]}
              closeOnSelect={false}
              onSelect={() => void onSelect(item.id)}
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
