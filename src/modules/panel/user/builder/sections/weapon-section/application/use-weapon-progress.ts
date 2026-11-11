import { updateBuild } from "@builds/client/build-store"
import {
  REFINEMENT_RANK_MAX,
  REFINEMENT_RANK_MIN,
  levelFromStep,
} from "@builds/domain/build"

/**
 * Level and refinement mutations of the weapon section.
 *
 * The slider works with a 0-based milestone step; the build always stores the
 * real weapon level and the 1-based refinement rank.
 */
export function useWeaponProgress(buildId: string) {
  const setLevelStep = (step: number) => {
    updateBuild(buildId, (draft) => {
      draft.weapon.level = levelFromStep(step)
      draft.updateAt = new Date().toISOString()
    })
  }

  const stepRefinement = (delta: number) => {
    updateBuild(buildId, (draft) => {
      const current = draft.weapon.refinament ?? REFINEMENT_RANK_MIN
      const next = Math.min(
        Math.max(current + delta, REFINEMENT_RANK_MIN),
        REFINEMENT_RANK_MAX
      )

      if (next === current) return

      draft.weapon.refinament = next
      draft.updateAt = new Date().toISOString()
    })
  }

  return { setLevelStep, stepRefinement }
}
