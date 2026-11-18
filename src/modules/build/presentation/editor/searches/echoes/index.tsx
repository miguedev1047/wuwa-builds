import { CommandSearch } from "@/components/blocks/command-search"
import { Suspense, useEffect, useRef, useState, type ReactElement } from "react"
import type { EchoSelectionSummary } from "@catalog/domain/echo"
import { useEchoBuildFilters } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"
import { EchoBuildResults } from "@build/presentation/editor/searches/echoes/components/echo-build-results"
import type { EchoesDataProps } from "@build/domain/build-record"
import { useSelectEcho } from "@build/presentation/editor/hooks/use-select-echo"
import { useRecommendedSonataFilter } from "@build/presentation/editor/searches/echoes/hooks/use-recommended-sonata-filter"

/** Inputs owned by this build search, not a shared search contract. */
type EchoBuildSearchProps = {
  slot: EchoesDataProps
  trigger: ReactElement
  resonatorId: number
}

/** Owns the build echo dialog, URL scope and selection behavior. */
export function EchoBuildSearch({
  slot,
  trigger,
  resonatorId,
}: EchoBuildSearchProps) {
  const filters = useEchoBuildFilters({ scope: `builder_echoes_${slot.index}` })
  const { reset } = filters
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)

  useRecommendedSonataFilter({ resonatorId, open, filters })

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

  const { selectEcho } = useSelectEcho()
  const handleSelect = (item: EchoSelectionSummary) => {
    const updated = selectEcho(slot.index, {
      id: item.id,
      name: item.name,
      class: item.class,
      cost: item.cost,
      icon: item.icon,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })
    if (updated) changeOpen(false)
  }

  return (
    <CommandSearch.Root
      trigger={trigger}
      open={open}
      onOpenChange={changeOpen}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
      filter={false}
      title="Buscar eco"
      description={`El eco elegido se asignará al slot ${slot.index + 1}.`}
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
        <EchoBuildResults
          filters={filters}
          selectedId={slot.data?.id}
          onSelect={handleSelect}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}
