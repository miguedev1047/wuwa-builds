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
import { useRecommendedSonataFilter } from "@build/presentation/editor/searches/echoes/hooks/use-recommended-sonata-filter"

/** Inputs owned by this build search, not a shared search contract. */
type EchoBuildSearchProps = {
  slotIndex: number
  selectedEchoId?: number
  trigger: ReactElement
  resonatorId: number
  /** Returns whether the host accepted this optimistic selection. */
  onSelect: (item: EchoSelectionSummary) => boolean
}

/** Owns the build echo dialog, URL scope and selection behavior. */
export function EchoBuildSearch({
  slotIndex,
  selectedEchoId,
  trigger,
  resonatorId,
  onSelect,
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

  const handleSelect = (item: EchoSelectionSummary) => {
    if (open && onSelect(item)) changeOpen(false)
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
