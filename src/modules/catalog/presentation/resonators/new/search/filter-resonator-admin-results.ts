import type { EncoreCharacterSummary } from "@encore/domain/character"
import type { ResonatorAdminFilters } from "@catalog/presentation/resonators/new/search/hooks/use-resonator-admin-filters"

/** Narrows this source's list and preserves its original objects. */
export function filterResonatorAdminResults({
  items,
  filters,
}: {
  items: readonly EncoreCharacterSummary[]
  filters: ResonatorAdminFilters
}): EncoreCharacterSummary[] {
  const words = filters.search
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  return items.filter((item) => {
    const text = `${item.name} ${item.id}`.toLocaleLowerCase()
    return (
      words.every((word) => text.includes(word)) &&
      (filters.rarity === null || item.rarity === filters.rarity) &&
      (filters.element === null || item.element === filters.element) &&
      (filters.weaponType === null || item.weaponType === filters.weaponType)
    )
  })
}
