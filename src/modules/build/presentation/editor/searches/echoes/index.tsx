import { CommandSearch } from "@/components/blocks/command-search"
import {
  Suspense,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactElement,
} from "react"
import type { EchoSelectionSummary } from "@catalog/domain/echo"
import { useEchoBuildFilters } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"
import { EchoBuildResults } from "@build/presentation/editor/searches/echoes/components/echo-build-results"
import { useSelectEcho } from "@build/presentation/editor/hooks/use-select-echo"
import { useRecommendedSonataFilter } from "@build/presentation/editor/searches/echoes/hooks/use-recommended-sonata-filter"

/** Inputs owned by this build search, not a shared search contract. */
type EchoBuildSearchProps = {
  slotIndex: number
  selectedEchoId?: number
  trigger: ReactElement
  resonatorId: number
}

/** Owns the build echo dialog, URL scope and selection behavior. */
export function EchoBuildSearch({
  slotIndex,
  selectedEchoId,
  trigger,
  resonatorId,
}: EchoBuildSearchProps) {
  const filters = useEchoBuildFilters({ scope: `builder_echoes_${slotIndex}` })
  const { reset } = filters
  const [open, setOpen] = useState(false)
  const needsReset = useRef(false)

  useRecommendedSonataFilter({ resonatorId, open, filters })

  const changeOpen = (next: boolean) => {
    if (next) needsReset.current = true
    setOpen(next)
  }

  const clearFilters = () => {
    if (!needsReset.current) return

    needsReset.current = false
    void reset()
  }
  const clearFiltersOnUnmount = useEffectEvent(clearFilters)
  useEffect(() => () => clearFiltersOnUnmount(), [])

  const { selectEcho } = useSelectEcho()
  const handleSelect = (item: EchoSelectionSummary) => {
    if (!open) return

    const updated = selectEcho(slotIndex, {
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
      onOpenChangeComplete={(next) => {
        if (!next && !open) clearFilters()
      }}
      search={filters.values.search}
      onSearchChange={(search) => void filters.setValues({ search })}
      filter={false}
      title="Buscar eco"
      description={`El eco elegido se asignará al slot ${slotIndex + 1}.`}
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
          selectedId={selectedEchoId}
          onSelect={handleSelect}
        />
      </Suspense>
    </CommandSearch.Root>
  )
}
