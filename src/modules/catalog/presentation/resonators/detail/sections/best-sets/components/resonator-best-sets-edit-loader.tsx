import { useSuspenseQuery } from "@tanstack/react-query"
import { characterQueries } from "@catalog/queries/characters"
import { sonataQueries } from "@catalog/queries/sonatas"
import { bestSetOptions } from "@catalog/presentation/resonators/detail/application/best-sets"
import { ResonatorBestSetsEditAction } from "@catalog/presentation/resonators/detail/sections/best-sets/components/resonator-best-sets-edit-action"

type ResonatorBestSetsEditLoaderProps = {
  resonatorId: number
}

/** Loads current recommendations and canonical Sonata catalog options. */
export function ResonatorBestSetsEditLoader({
  resonatorId,
}: ResonatorBestSetsEditLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: sonatas } = useSuspenseQuery(sonataQueries.list())

  return (
    <ResonatorBestSetsEditAction
      resonatorId={resonatorId}
      setIds={resonator.bestSets.map(({ setId }) => String(setId))}
      options={bestSetOptions(sonatas)}
    />
  )
}
