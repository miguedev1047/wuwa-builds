import {
  weaponTypeParser,
  elementParser,
} from "@/modules/game-data/presentation/category-parsers"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useCallback } from "react"

/** URL backed state for the resonator picker search and filters. */
export function useResonatorSearchParams() {
  const [resonatorName, setResonatorName] = useQueryState(
    "resonatopr_name",
    parseAsString.withOptions({ history: "replace" })
  )
  const [resonatorRarity, setResonatorRarity] = useQueryState(
    "resonator_rarity",
    parseAsInteger.withOptions({ history: "replace" })
  )
  const [resonatorWeaponType, setResonatorWeaponType] = useQueryState(
    "resonator_weapon_type",
    weaponTypeParser.withOptions({ history: "replace" })
  )
  const [resonatorElement, setResonatorElement] = useQueryState(
    "resonator_element",
    elementParser.withOptions({ history: "replace" })
  )

  const hasActiveFilter =
    !!resonatorName ||
    !!resonatorRarity ||
    !!resonatorWeaponType ||
    !!resonatorElement

  const clearSearchParams = useCallback(() => {
    void setResonatorName(null)
    void setResonatorRarity(null)
    void setResonatorWeaponType(null)
    void setResonatorElement(null)
  }, [
    setResonatorName,
    setResonatorRarity,
    setResonatorWeaponType,
    setResonatorElement,
  ])

  return {
    clearSearchParams,
    hasActiveFilter,
    resonatorName,
    resonatorRarity,
    resonatorWeaponType,
    resonatorElement,
    setResonatorName,
    setResonatorRarity,
    setResonatorWeaponType,
    setResonatorElement,
  }
}
