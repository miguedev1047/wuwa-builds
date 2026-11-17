import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { Suspense, useEffect, useRef, useState } from "react"
import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import { useWeaponAdminFilters } from "@catalog/presentation/searches/weapons/hooks/use-weapon-admin-filters"
import { WeaponAdminResults } from "@catalog/presentation/searches/weapons/components/weapon-admin-results"

/** Inputs owned by this admin search, not a shared search contract. */
type WeaponAdminSearchProps = {
  selectedId?: number | null
  onSelect: (item: EncoreWeaponSummary) => void
  disabled?: boolean
}

/** Owns the admin weapon dialog, URL scope and selection behavior. */
export function WeaponAdminSearch({
  selectedId,
  onSelect,
  disabled,
}: WeaponAdminSearchProps) {
  const filters = useWeaponAdminFilters({ scope: "admin_weapons" })
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

  const handleSelect = (item: EncoreWeaponSummary) => {
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
          Buscar arma
        </Button>
      }
      open={open}
      onOpenChange={changeOpen}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
      filter={false}
      title="Buscar arma"
      description={"Copia los datos de Encore al formulario."}
    >
      <CommandSearch.Input placeholder="Nombre, tipo o ID del arma">
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
        <WeaponAdminResults
          filters={filters}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}
