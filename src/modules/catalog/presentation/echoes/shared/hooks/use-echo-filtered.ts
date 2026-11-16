import { encoreEchoQueries } from "@/modules/encore/queries/catalogs"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useEchoSearchParams } from "@catalog/presentation/echoes/shared/hooks/use-echo-search-params"

export function useEchoesFiltered() {
  const searchParams = useEchoSearchParams()
  const { data: echoes } = useSuspenseQuery(
    encoreEchoQueries.withSonataEffects()
  )

  const filteredEchoes = echoes.filter((item) => {
    const matchesName =
      searchParams.echoName === null ||
      item.name
        .toLocaleLowerCase()
        .includes(searchParams.echoName.toLocaleLowerCase())
    const matchesSet =
      searchParams.echoSet === null ||
      item.sets.some((set) => set.id === searchParams.echoSet)
    const matchesCost =
      searchParams.echoCost === null || item.cost === searchParams.echoCost
    const matchesClass =
      searchParams.echoClass === null || item.class === searchParams.echoClass

    return matchesName && matchesSet && matchesCost && matchesClass
  })

  return {
    filteredEchoes,
    ...searchParams,
  }
}
