import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { characterQueries } from "@catalog/queries/characters"
import type { EchoBuildFilterState } from "@build/presentation/editor/searches/echoes/hooks/use-echo-build-filters"

/** Applies the resonator's first recommended sonata when opening the search. */
export function useRecommendedSonataFilter({
  resonatorId,
  open,
  filters,
}: {
  resonatorId: number
  open: boolean
  filters: EchoBuildFilterState
}) {
  const { data: resonator } = useQuery(characterQueries.detail(resonatorId))
  const recommendedSonataId = resonator?.bestSets[0]?.setId
  const { setValues } = filters

  useEffect(() => {
    if (!open || recommendedSonataId === undefined) return

    void setValues({ sonataId: recommendedSonataId })
  }, [open, recommendedSonataId, setValues])

}
