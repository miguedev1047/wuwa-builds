import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { EchoItem } from "@catalog/presentation/components/entity-item"
import { groupEchoesBySonata } from "@catalog/presentation/echoes/list/application/group-echoes-by-sonata"
import {
  EchoCatalogSearchFilterFields,
  useEchoCatalogSearchFilters,
  type EchoCatalogSearchFilterState,
} from "@catalog/presentation/echoes/list/components/echo-catalog-search-filters"
import { echoQueries } from "@catalog/queries/echoes"
import { sonataQueries } from "@catalog/queries/sonatas"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSuspenseQueries } from "@tanstack/react-query"
import { Suspense, useState } from "react"

type EchoCatalogSearchProps = {
  /** Receives the selected catalog record's ID. */
  onSelect: (id: number) => void | Promise<void>
}

/** Finds and selects a saved echo in the catalog. */
export function EchoCatalogSearch({ onSelect }: EchoCatalogSearchProps) {
  const filters = useEchoCatalogSearchFilters({
    scope: "admin_catalog_echoes",
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
          aria-label="Buscar eco"
        >
          <HugeiconsIcon icon={Search01Icon} />
        </Button>
      }
      title="Buscar eco"
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
        <EchoCatalogSearchResults filters={filters} onSelect={handleSelect} />
      </Suspense>
    </CommandSearch.Root>
  )
}

function EchoCatalogSearchResults({
  filters,
  onSelect,
}: {
  filters: EchoCatalogSearchFilterState
  onSelect: (id: number) => Promise<void>
}) {
  const [{ data }, { data: sonatas }] = useSuspenseQueries({
    queries: [echoQueries.selection(), sonataQueries.list()],
  })
  const sonataOptions = sonatas.map(({ id, name, icon }) => ({
    value: id,
    label: name,
    icon,
  }))
  const { cost, class: echoClass, sonataId } = filters.values
  const items = data.filter(
    (item) =>
      (cost === null || item.cost === cost) &&
      (echoClass === null || item.class === echoClass)
  )
  const groups = groupEchoesBySonata(items, sonatas).filter(
    (group) => sonataId === null || group.setId === sonataId
  )

  return (
    <>
      <CommandSearch.FilterContent
        hasActiveFilter={filters.hasActiveFilters}
        onClearFilters={() => void filters.reset()}
      >
        <EchoCatalogSearchFilterFields
          filters={filters}
          sonataOptions={sonataOptions}
        />
      </CommandSearch.FilterContent>
      <CommandSearch.List>
        <CommandSearch.Empty>No se encontraron ecos.</CommandSearch.Empty>
        {groups.map((group) => (
          <CommandSearch.Group
            key={group.setId ?? "sin-sonata"}
            heading={group.name}
          >
            {group.echoes.map((item) => (
              <CommandSearch.Item
                key={item.id}
                value={`${group.setId ?? "sin-sonata"}:${item.id}`}
                textValue={item.name}
                keywords={[String(item.id)]}
                closeOnSelect={false}
                onSelect={() => void onSelect(item.id)}
                kind={`Coste ${item.cost}`}
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
