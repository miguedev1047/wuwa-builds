import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { Suspense, useEffect, useRef, useState } from "react"
import type { EncoreCharacterSummary } from "@encore/domain/character"
import { useResonatorAdminFilters } from "@catalog/presentation/searches/resonators/hooks/use-resonator-admin-filters"
import { ResonatorAdminResults } from "@catalog/presentation/searches/resonators/components/resonator-admin-results"

/** Inputs owned by this admin search, not a shared search contract. */
type ResonatorAdminSearchProps = {
  selectedId?: number | null
  onSelect: (item: EncoreCharacterSummary) => void
  disabled?: boolean
}

/** Owns the admin resonator dialog, URL scope and selection behavior. */
export function ResonatorAdminSearch({
  selectedId,
  onSelect,
  disabled,
}: ResonatorAdminSearchProps) {
  const filters = useResonatorAdminFilters({ scope: "admin_resonators" })
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

  const handleSelect = (item: EncoreCharacterSummary) => {
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
          Buscar resonador
        </Button>
      }
      open={open}
      onOpenChange={changeOpen}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
      filter={false}
      title="Buscar resonador"
      description={"Copia los datos de Encore al formulario."}
    >
      <CommandSearch.Input placeholder="Nombre o ID del resonador">
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
        <ResonatorAdminResults
          filters={filters}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}
