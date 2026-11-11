import { updateBuild } from "@builds/client/build-store"
import { levelFromStep } from "@builds/domain/build"

/**
 * Level and sequence mutations of the resonator section.
 *
 * Sliders and sequence nodes work with a 0-based step; the build always stores
 * the real game level and the sequence rank.
 */
export function useResonatorProgress(buildId: string) {
  const setLevelStep = (step: number) => {
    updateBuild(buildId, (draft) => {
      draft.resonator.level = levelFromStep(step)
      draft.updateAt = new Date().toISOString()
    })
  }

  const toggleSequence = (rank: number) => {
    updateBuild(buildId, (draft) => {
      const isSame = draft.resonator.sequency === rank

      draft.resonator.sequency = isSame ? 0 : rank
      draft.updateAt = new Date().toISOString()
    })
  }

  return { setLevelStep, toggleSequence }
}
