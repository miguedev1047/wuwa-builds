import { useSuspenseQuery } from "@tanstack/react-query"
import { useWeaponSearchParams } from "@catalog/presentation/weapons/shared/hooks/use-weapon-search-params"
import { encoreWeaponQueries } from "@/modules/encore/queries/catalogs"

export function useWeaponFiltered() {
  const searchParams = useWeaponSearchParams()
  const { data: weapons } = useSuspenseQuery(encoreWeaponQueries.list())

  const filteredWeapons = weapons.filter((item) => {
    const matchesName =
      searchParams.weaponName === null ||
      item.name
        .toLocaleLowerCase()
        .includes(searchParams.weaponName.toLocaleLowerCase())
    const matchesType =
      searchParams.weaponType === null || item.type === searchParams.weaponType
    const matchesRarity =
      searchParams.weaponRarity === null ||
      item.rarity === searchParams.weaponRarity

    return matchesName && matchesType && matchesRarity
  })

  return {
    filteredWeapons,
    ...searchParams,
  }
}
