import type { WeaponSummary } from "@catalog/domain/weapon"
import type { WeaponBuildFilters } from "@build/presentation/editor/searches/weapons/hooks/use-weapon-build-filters"
import {
  categoryLabel,
  WEAPON_TYPES,
  type WeaponTypeId,
} from "@/modules/game-data/domain/categories"

/** Narrows this source's list and preserves its original objects. */
export function filterWeaponBuildResults({
  items,
  filters,
  weaponType,
}: {
  items: readonly WeaponSummary[]
  filters: WeaponBuildFilters
  weaponType?: WeaponTypeId
}): WeaponSummary[] {
  const words = filters.search
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  return items.filter((item) => {
    const text =
      `${item.name} ${item.id} ${categoryLabel(WEAPON_TYPES, item.type)}`.toLocaleLowerCase()
    return (
      (!weaponType || item.type === weaponType) &&
      words.every((word) => text.includes(word)) &&
      (filters.rarity === null || item.rarity === filters.rarity) &&
      (filters.type === null || item.type === filters.type)
    )
  })
}
