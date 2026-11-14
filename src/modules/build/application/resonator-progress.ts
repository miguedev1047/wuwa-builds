import {
  withPassiveEnabled,
  withSkillLevel,
} from "@build/application/resonator-config"
import { levelFromStep } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"

/** Apply resonator progression to the current build draft. */
export const resonatorProgress = {
  setLevelStep(draft: BuildProps, step: number) {
    draft.resonator.level = levelFromStep(step)
    draft.updateAt = new Date().toISOString()
  },

  toggleSequence(draft: BuildProps, rank: number) {
    const isSame = draft.resonator.sequency === rank

    draft.resonator.sequency = isSame ? 0 : rank
    draft.updateAt = new Date().toISOString()
  },

  setSkillLevel(draft: BuildProps, skillId: number, level: number) {
    draft.resonator.skills = withSkillLevel(
      draft.resonator.skills,
      skillId,
      level
    )
    draft.updateAt = new Date().toISOString()
  },

  togglePassive(draft: BuildProps, id: number, enabled: boolean) {
    draft.resonator.passives = withPassiveEnabled(
      draft.resonator.passives,
      id,
      enabled
    )
    draft.updateAt = new Date().toISOString()
  },
}
