import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { Suspense, useEffect, useRef, useState } from "react"
import type { EncoreEchoSummary } from "@encore/domain/echo"
import { useEchoAdminFilters } from "@catalog/presentation/echoes/new/search/hooks/use-echo-admin-filters"
import { EchoAdminResults } from "@catalog/presentation/echoes/new/search/components/echo-admin-results"

/** Inputs owned by this admin search, not a shared search contract. */
type EchoAdminSearchProps = {
  selectedId?: number | null
  onSelect: (item: EncoreEchoSummary) => void
  disabled?: boolean
}

/** Owns the admin echo dialog, URL scope and selection behavior. */
export function EchoAdminSearch({
  selectedId,
  onSelect,
  disabled,
}: EchoAdminSearchProps) {
  const filters = useEchoAdminFilters({ scope: "admin_echoes" })
  const { reset } = filters
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)

  const changeOpen = (next: boolean) => {
    openRef.current = next
    setOpen(next)
    if (!next) void reset()
  }
  useEffect(
    () => () => {
      if (openRef.current) void reset()
      openRef.current = false
    },
    [reset]
  )

  const handleSelect = (item: EncoreEchoSummary) => {
    onSelect(item)
    changeOpen(false)
  }

  return (
    <CommandSearch.Root
      trigger={
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={disabled}
        >
          Buscar eco
        </Button>
      }
      open={open}
      onOpenChange={changeOpen}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
      filter={false}
      title="Buscar eco"
      description={"Copia los datos de Encore al formulario."}
    >
      <CommandSearch.Input placeholder="Nombre o ID del eco">
        <CommandSearch.FilterTrigger />
      </CommandSearch.Input>
      <CommandSearch.Separator />
      <Suspense
        fallback={
          <CommandSearch.List>
            <CommandSearch.Loading />
          </CommandSearch.List>
        }
      >
        <EchoAdminResults
          filters={filters}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}
