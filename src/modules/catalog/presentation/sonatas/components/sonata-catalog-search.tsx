import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { createSearchFilters } from "@/hooks/create-search-filters"
import { sonataQueries } from "@catalog/queries/sonatas"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { parseAsString } from "nuqs"
import { Suspense, useRef, useState } from "react"

const useSonataSearchFilters = createSearchFilters({
  search: parseAsString.withDefault(""),
})

type SonataCatalogSearchProps = {
  /** Receives the ID of the selected sonata after the dialog closes. */
  onSelect: (id: number) => void | Promise<void>
}

/** Finds a sonata in the admin catalog by name or ID. */
export function SonataCatalogSearch({ onSelect }: SonataCatalogSearchProps) {
  const filters = useSonataSearchFilters({ scope: "admin_catalog_sonatas" })
  const [open, setOpen] = useState(false)
  const selectedId = useRef<number | null>(null)

  return (
    <CommandSearch.Root
      trigger={
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Buscar sonata"
        >
          <HugeiconsIcon icon={Search01Icon} />
        </Button>
      }
      title="Buscar sonata"
      description="Selecciona un set para ir a su tarjeta en la lista."
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next && selectedId.current === null) void filters.reset()
      }}
      onOpenChangeComplete={(next) => {
        if (next || selectedId.current === null) return
        const id = selectedId.current
        selectedId.current = null
        void filters.reset().then(() => onSelect(id))
      }}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
    >
      <CommandSearch.Input placeholder="Nombre o ID de la sonata" />
      <CommandSearch.Separator />
      <Suspense fallback={<CommandSearch.Loading />}>
        <SonataCatalogSearchResults
          onSelect={(id) => {
            selectedId.current = id
            setOpen(false)
          }}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}

function SonataCatalogSearchResults({
  onSelect,
}: {
  onSelect: (id: number) => void
}) {
  const { data: sonatas } = useSuspenseQuery(sonataQueries.list())

  return (
    <CommandSearch.List>
      <CommandSearch.Empty>No se encontraron sonatas.</CommandSearch.Empty>
      <CommandSearch.Group heading="Sonatas">
        {sonatas.map(({ id, name, icon }) => (
          <CommandSearch.Item
            key={id}
            value={String(id)}
            textValue={name}
            keywords={[String(id)]}
            closeOnSelect={false}
            onSelect={() => onSelect(id)}
            icon={
              icon && (
                <img src={icon} alt="" className="size-full object-contain" />
              )
            }
          >
            {name}
          </CommandSearch.Item>
        ))}
      </CommandSearch.Group>
    </CommandSearch.List>
  )
}
