import type { WeaponRefinementRow, WeaponRefinementStatRow } from "@db/schema"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import type {
  WeaponRefinementStatsFormValues,
  WeaponRefinementStatInput,
  WeaponRefinementUpdateInput,
} from "@game-data/application/schemas"

/** Visible fields of the refinement form that Encore can prefill. */
export type WeaponRefinementDraft = {
  sortOrder: number
  name: string
  effect: string
}

/**
 * Maps a refinement rank from Encore to the add form values.
 *
 * Every rank already carries its expanded effect, so the form can copy it
 * verbatim instead of building the `"a/b/c/d/e"` template again.
 */
export function weaponRefinementDraftFromEncore(
  refinement: EncoreWeaponRefinement
): WeaponRefinementDraft {
  return {
    sortOrder: refinement.rank,
    name: refinement.name,
    effect: refinement.effect,
  }
}

/** Maps a saved refinement row to the edit form values. */
export function weaponRefinementDraftFromRow(
  refinement: WeaponRefinementRow
): WeaponRefinementUpdateInput {
  return {
    id: refinement.id,
    weaponId: refinement.weaponId,
    sortOrder: refinement.sortOrder,
    name: refinement.name,
    effect: refinement.effect,
  }
}

/** Visible fields of one stat row in the add/edit dialog. */
export type WeaponStatDraft = {
  statName: string
  value: number
}

/** Maps a saved stat row to the edit form values. */
export function weaponStatDraftFromRow(
  stat: WeaponRefinementStatRow
): WeaponStatDraft {
  return {
    statName: stat.statName,
    value: stat.statNumber,
  }
}

/**
 * Payloads for every stat row of the dialog.
 *
 * Rows get consecutive sort orders starting at the value prepared by the card,
 * so the whole selection is stored in one request.
 */
export function weaponStatPayloads(
  values: WeaponRefinementStatsFormValues
): WeaponRefinementStatInput[] {
  return values.stats.map((stat, index) => ({
    refinementId: values.refinementId,
    sortOrder: values.sortOrder + index,
    statName: stat.statName,
    statNumber: stat.value,
  }))
}
