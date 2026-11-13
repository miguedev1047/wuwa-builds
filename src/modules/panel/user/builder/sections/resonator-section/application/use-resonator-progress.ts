import {
  withPassiveEnabled,
  withSkillLevel,
} from "@builds/application/resonator-config"
import { updateBuild } from "@builds/client/build-store"
import { levelFromStep } from "@builds/domain/build"

/**
 * Level, sequence, skill and passive mutations of the resonator section.
 *
 * Sliders and sequence nodes work with a 0-based step; the build always stores
 * the real game level and the sequence rank. Skill sliders and passive toggles
 * write directly to the build collection.
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

  const setSkillLevel = (skillId: number, level: number) => {
    updateBuild(buildId, (draft) => {
      draft.resonator.skills = withSkillLevel(
        draft.resonator.skills,
        skillId,
        level
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  const togglePassive = (id: number, enabled: boolean) => {
    updateBuild(buildId, (draft) => {
      draft.resonator.passives = withPassiveEnabled(
        draft.resonator.passives,
        id,
        enabled
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  return { setLevelStep, toggleSequence, setSkillLevel, togglePassive }
}
