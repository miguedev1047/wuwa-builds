import { QuerySelect } from "@/components/blocks/query-select"
import {
  RESONATOR_ELEMENTS,
  RESONATOR_RARITY,
  RESONATOR_RARITY_MAX_RANGE,
  RESONATOR_WEAPON_TYPES,
} from "@/modules/catalog/application/constants/resonator"
import { useResonatorSearchParams } from "@catalog/presentation/resonators/shared/hooks/use-resonator-search-params"

export function ResonatorSearchFilters() {
  const {
    resonatorRarity,
    resonatorElement,
    resonatorWeaponType,
    setResonatorWeaponType,
    setResonatorRarity,
    setResonatorElement,
  } = useResonatorSearchParams()

  return (
    <>
      <QuerySelect
        placeholder="Filtrar por rareza"
        items={RESONATOR_RARITY.slice(0, RESONATOR_RARITY_MAX_RANGE)}
        value={resonatorRarity}
        onValueChange={(value) =>
          void setResonatorRarity(typeof value === "number" ? value : null)
        }
      />
      <QuerySelect
        placeholder="Filtrar por elemento"
        items={RESONATOR_ELEMENTS}
        value={resonatorElement}
        onValueChange={(value) =>
          void setResonatorElement(typeof value === "string" ? value : null)
        }
      />
      <QuerySelect
        placeholder="Filtrar por arma"
        items={RESONATOR_WEAPON_TYPES}
        value={resonatorWeaponType}
        onValueChange={(value) =>
          void setResonatorWeaponType(typeof value === "string" ? value : null)
        }
      />
    </>
  )
}
