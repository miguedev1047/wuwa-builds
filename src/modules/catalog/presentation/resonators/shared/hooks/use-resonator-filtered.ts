import { useSuspenseQuery } from "@tanstack/react-query"
import { useResonatorSearchParams } from "@catalog/presentation/resonators/shared/hooks/use-resonator-search-params"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"

export function useResonatorsFiltered() {
  const searchParams = useResonatorSearchParams()
  const { data: resonators } = useSuspenseQuery(encoreCharacterQueries.list())

  const filteredResonators = resonators.filter((item) => {
    const matchesName =
      searchParams.resonatorName === null ||
      item.name
        .toLocaleLowerCase()
        .includes(searchParams.resonatorName.toLocaleLowerCase())
    const matchesWeaponType =
      searchParams.resonatorWeaponType === null ||
      item.weaponType === searchParams.resonatorWeaponType
    const matchesRarity =
      searchParams.resonatorRarity === null ||
      item.rarity === searchParams.resonatorRarity
    const matchesElement =
      searchParams.resonatorElement === null ||
      item.element === searchParams.resonatorElement

    return matchesName && matchesWeaponType && matchesRarity && matchesElement
  })

  return {
    filteredResonators,
    ...searchParams,
  }
}
