import type { CharacterSummary } from "@catalog/domain/character"
import type { ResonatorBuildFilters } from "@build/presentation/editor/searches/resonators/hooks/use-resonator-build-filters"

/** Narrows this source's list and preserves its original objects. */
export function filterResonatorBuildResults({
  items,
  filters,
}: {
  items: readonly CharacterSummary[]
  filters: ResonatorBuildFilters
}): CharacterSummary[] {
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
