import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { Suspense, useEffect, useRef, useState } from "react"
import type { WeaponSummary } from "@catalog/domain/weapon"
import { useWeaponBuildFilters } from "@build/presentation/editor/searches/weapons/hooks/use-weapon-build-filters"
import { WeaponBuildResults } from "@build/presentation/editor/searches/weapons/components/weapon-build-results"
import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { useSelectWeapon } from "@build/presentation/editor/hooks/use-select-weapon"
import { Show } from "@/components/utility/show"

/** Inputs owned by this build search, not a shared search contract. */
type WeaponBuildSearchProps = { build: BuildProps }

/** Owns the build weapon dialog, URL scope and selection behavior. */
export function WeaponBuildSearch({ build }: WeaponBuildSearchProps) {
  const filters = useWeaponBuildFilters({ scope: "builder_weapons" })
  const { reset } = filters
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const version = useRef(0)
  const changeOpen = (next: boolean) => {
    version.current += 1
    openRef.current = next
    setOpen(next)
    if (!next) void reset()
  }
  useEffect(
    () => () => {
      version.current += 1
      if (openRef.current) void reset()
      openRef.current = false
    },
    [reset]
  )

  const { selectWeapon } = useSelectWeapon()
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  const handleSelect = async (item: WeaponSummary) => {
    if (busy.current) return
    busy.current = true
    setPending(true)
    const selectedVersion = version.current
    try {
      const result = await selectWeapon(item)
      if (result && selectedVersion === version.current) changeOpen(false)
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  let trigger = (
    <BuildWorkspace.Empty>
      <BuildWorkspace.EmptyTitle title="Seleccionar arma" />
    </BuildWorkspace.Empty>
  )
  if (build.weapon.data)
    trigger = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Cambiar arma"
      >
        <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
      </Button>
    )

  return (
    <Show
      when={build.resonator.data}
      fallback={
        <BuildWorkspace.Empty enabled={false}>
          <BuildWorkspace.EmptyTitle title="Primero selecciona un resonador" />
        </BuildWorkspace.Empty>
      }
    >
      <CommandSearch.Root
        trigger={trigger}
        open={open}
        onOpenChange={changeOpen}
        search={filters.values.search}
        onSearchChange={(search) => void filters.setValues({ search })}
        filter={false}
        title="Buscar arma"
        description={"Solo se muestran las armas compatibles con el resonador."}
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
          <WeaponBuildResults
            filters={filters}
            selectedId={build.weapon.data?.id}
            onSelect={handleSelect}
            pending={pending}
            weaponType={build.resonator.data?.weaponType}
          />
        </Suspense>
      </CommandSearch.Root>
    </Show>
  )
}
