import { weaponTypeParser } from "@/modules/game-data/presentation/category-parsers"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useCallback } from "react"

/** URL backed state for the weapon picker search and filters. */
export function useWeaponSearchParams() {
  const [weaponName, setWeaponName] = useQueryState(
    "weapon_name",
    parseAsString.withOptions({ history: "replace" })
  )
  const [weaponRarity, setWeaponRarity] = useQueryState(
    "weapon_rarity",
    parseAsInteger.withOptions({ history: "replace" })
  )
  const [weaponType, setWeaponType] = useQueryState(
    "weapon_type",
    weaponTypeParser.withOptions({ history: "replace" })
  )

  const hasActiveFilter = !!weaponName || !!weaponRarity || !!weaponType

  const clearSearchParams = useCallback(() => {
    void setWeaponName(null)
    void setWeaponRarity(null)
    void setWeaponType(null)
  }, [setWeaponName, setWeaponRarity, setWeaponType])

  return {
    clearSearchParams,
    hasActiveFilter,
    weaponName,
    weaponRarity,
    weaponType,
    setWeaponName,
    setWeaponRarity,
    setWeaponType,
  }
}
