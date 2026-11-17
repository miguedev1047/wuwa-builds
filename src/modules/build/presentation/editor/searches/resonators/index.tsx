import { CommandSearch } from "@/components/blocks/command-search"
import { Button } from "@/components/panelui/button"
import { Suspense, useEffect, useRef, useState, useTransition } from "react"
import type { CharacterSummary } from "@catalog/domain/character"
import { useResonatorBuildFilters } from "@build/presentation/editor/searches/resonators/hooks/use-resonator-build-filters"
import { ResonatorBuildResults } from "@build/presentation/editor/searches/resonators/components/resonator-build-results"
import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"
import { useSelectResonator } from "@build/presentation/editor/hooks/use-select-resonator"

/** Inputs owned by this build search, not a shared search contract. */
type ResonatorBuildSearchProps = { build: BuildProps }

/** Owns the build resonator dialog, URL scope and selection behavior. */
export function ResonatorBuildSearch({ build }: ResonatorBuildSearchProps) {
  const filters = useResonatorBuildFilters({ scope: "builder_resonators" })
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

  const { selectResonator } = useSelectResonator()
  const [pending, startTransition] = useTransition()
  const busy = useRef(false)

  const handleSelect = (item: CharacterSummary): Promise<void> => {
    if (busy.current) return Promise.resolve()

    busy.current = true
    const selectedVersion = version.current
    const selection = (async () => {
      try {
        const result = await selectResonator(item)

        if (
          (result === "selected" || result === "unchanged") &&
          selectedVersion === version.current
        )
          changeOpen(false)
      } finally {
        busy.current = false
      }
    })()
    startTransition(() => selection)

    return selection
  }

  let trigger = (
    <BuildWorkspace.Empty>
      <BuildWorkspace.EmptyTitle title="Seleccionar resonador" />
    </BuildWorkspace.Empty>
  )
  if (build.resonator.data)
    trigger = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Cambiar resonador"
      >
        <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
      </Button>
    )

  return (
    <CommandSearch.Root
      trigger={trigger}
      open={open}
      onOpenChange={changeOpen}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
      filter={false}
      title="Buscar resonador"
      description={"Selecciona un resonador del catálogo para esta build."}
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
        <ResonatorBuildResults
          filters={filters}
          selectedId={build.resonator.data?.id}
          onSelect={handleSelect}
          pending={pending}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}
