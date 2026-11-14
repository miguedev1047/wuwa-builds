import type { WeaponRow } from "@db/schema"
import type { EncoreWeaponDetail } from "@encore/domain/weapon"
import type { WeaponInput } from "@catalog/application/schemas"

/**
 * Fills the admin form with a full Encore weapon.
 *
 * The list endpoint only carries a summary, so the form requests the detail
 * before prefilling: that is where the description lives.
 */
export function weaponDraftFromEncore(weapon: EncoreWeaponDetail): WeaponInput {
  return {
    id: weapon.id,
    name: weapon.name,
    rarity: weapon.rarity,
    type: weapon.type,
    icon: weapon.icon,
    description: weapon.description,
  }
}

/** Maps a saved weapon row to the edit form values. */
export function weaponDraftFromRow(weapon: WeaponRow): WeaponInput {
  return {
    id: weapon.id,
    name: weapon.name,
    rarity: weapon.rarity,
    type: weapon.type,
    icon: weapon.icon,
    description: weapon.description,
  }
}
