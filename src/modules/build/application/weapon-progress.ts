import {
  REFINEMENT_RANK_MAX,
  REFINEMENT_RANK_MIN,
  levelFromStep,
} from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"

/** Apply weapon progression to the current build draft. */
export const weaponProgress = {
  setLevelStep(draft: BuildProps, step: number) {
    draft.weapon.level = levelFromStep(step)
    draft.updateAt = new Date().toISOString()
  },

  stepRefinement(draft: BuildProps, delta: number) {
    const current = draft.weapon.refinament ?? REFINEMENT_RANK_MIN
    const next = Math.min(
      Math.max(current + delta, REFINEMENT_RANK_MIN),
      REFINEMENT_RANK_MAX
    )

    if (next === current) return

    draft.weapon.refinament = next
    draft.updateAt = new Date().toISOString()
  },
}
