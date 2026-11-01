import type { EncoreCharacterDetail } from "@/modules/encore/domain/character"
import type { ResonatorRow } from "@/db/schema"
import type { ResonatorInput } from "@/modules/panel/admin/game-data/application/schemas"

/**
 * Fills the admin form with a full Encore character.
 *
 * The list endpoint only carries a summary, so the form requests the detail
 * before prefilling: that is where `introduction` and the image fields live.
 */
export function resonatorDraftFromEncore(
  character: EncoreCharacterDetail
): ResonatorInput {
  return {
    id: character.id,
    name: character.name,
    introduction: character.introduction,
    rarity: character.rarity,
    element: character.element,
    weaponType: character.weaponType,
    icon: character.icon || character.images.icon,
    card: character.images.card,
    circle: character.images.circle,
    portrait: character.images.portrait,
    iconLarge: character.images.iconLarge,
  }
}

/** Maps a saved row from D1 to the edit form values. */
export function resonatorDraftFromRow(resonator: ResonatorRow): ResonatorInput {
  return {
    id: resonator.id,
    name: resonator.name,
    introduction: resonator.introduction,
    rarity: resonator.rarity,
    element: resonator.element,
    weaponType: resonator.weaponType,
    icon: resonator.icon,
    card: resonator.card,
    circle: resonator.circle,
    portrait: resonator.portrait,
    iconLarge: resonator.iconLarge,
  }
}
