import type { WeaponRefinementRow, WeaponRefinementStatRow } from "@db/schema"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import type {
  WeaponRefinementInput,
  WeaponRefinementStatsFormValues,
  WeaponRefinementStatInput,
  WeaponRefinementUpdateInput,
} from "@catalog/application/schemas"

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

/** One Encore refinement offered by the refinement multi-select. */
export type WeaponRefinementOption = {
  label: string
  value: string
  draft: WeaponRefinementDraft
}

/** Values handled by the refinement form, including the Encore selection. */
export type WeaponRefinementFormValues = WeaponRefinementUpdateInput & {
  /** Selected `WeaponRefinementOption` values, when the form offers them. */
  encoreRefinements?: string[]
}

/** Encore refinements the weapon does not have yet, by rank. */
export function weaponRefinementOptions(
  encoreRefinements: EncoreWeaponRefinement[],
  savedRanks: number[]
): WeaponRefinementOption[] {
  return encoreRefinements.flatMap((refinement) => {
    if (savedRanks.includes(refinement.rank)) return []

    return [
      {
        label: `Refinamiento ${refinement.rank} — ${refinement.name}`,
        value: String(refinement.rank),
        draft: weaponRefinementDraftFromEncore(refinement),
      },
    ]
  })
}

/**
 * Payloads for the selected Encore ranks, or the manual entry.
 *
 * A rank already carries its `sortOrder`, so the selected refinements are sent
 * as they are; the manual values use the rank chosen in the form.
 */
export function weaponRefinementPayloads(
  values: WeaponRefinementFormValues,
  options: WeaponRefinementOption[]
): WeaponRefinementInput[] {
  const selected = values.encoreRefinements ?? []

  if (selected.length === 0) {
    return [
      {
        weaponId: values.weaponId,
        sortOrder: values.sortOrder,
        name: values.name,
        effect: values.effect,
      },
    ]
  }

  return options
    .filter((option) => selected.includes(option.value))
    .map((option) => ({
      weaponId: values.weaponId,
      ...option.draft,
    }))
}
