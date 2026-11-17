import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import type { WeaponAdminFilters } from "@catalog/presentation/searches/weapons/hooks/use-weapon-admin-filters"
import {
  categoryLabel,
  WEAPON_TYPES,
} from "@/modules/game-data/domain/categories"

/** Narrows this source's list and preserves its original objects. */
export function filterWeaponAdminResults({
  items,
  filters,
}: {
  items: readonly EncoreWeaponSummary[]
  filters: WeaponAdminFilters
}): EncoreWeaponSummary[] {
  const words = filters.search
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  return items.filter((item) => {
    const text =
      `${item.name} ${item.id} ${categoryLabel(WEAPON_TYPES, item.type)}`.toLocaleLowerCase()
    return (
      words.every((word) => text.includes(word)) &&
      (filters.rarity === null || item.rarity === filters.rarity) &&
      (filters.type === null || item.type === filters.type)
    )
  })
}
