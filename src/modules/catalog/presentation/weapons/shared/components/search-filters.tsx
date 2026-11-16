import { QuerySelect } from "@/components/blocks/query-select"
import { useWeaponSearchParams } from "@catalog/presentation/weapons/shared/hooks/use-weapon-search-params"
import {
  WEAPON_RARITY,
  WEAPON_RARITY_MAX_RANGE,
} from "@/modules/catalog/application/constants/weapon"
import { WEAPON_TYPES } from "@/modules/catalog/application/weapons/types"

export function WeaponSearchFilters() {
  const { weaponRarity, weaponType, setWeaponType, setWeaponRarity } =
    useWeaponSearchParams()

  return (
    <>
      <QuerySelect
        placeholder="Filtrar por rareza"
        items={WEAPON_RARITY.slice(0, WEAPON_RARITY_MAX_RANGE)}
        value={weaponRarity}
        onValueChange={(value) =>
          void setWeaponRarity(typeof value === "number" ? value : null)
        }
      />
      <QuerySelect
        placeholder="Filtrar por tipo"
        items={WEAPON_TYPES}
        value={weaponType}
        onValueChange={(value) =>
          void setWeaponType(typeof value === "number" ? value : null)
        }
      />
    </>
  )
}
