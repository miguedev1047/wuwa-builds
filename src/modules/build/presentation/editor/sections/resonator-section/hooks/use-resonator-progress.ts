import { resonatorProgress } from "@build/application/resonator-progress"
import { updateBuild, type LocalBuildIdentity } from "@build/client/build-store"

/** Bind resonator progression to the current local build. */
export function useResonatorProgress(identity: LocalBuildIdentity) {
  return {
    setLevelStep: (step: number) => {
      updateBuild(identity, (draft) =>
        resonatorProgress.setLevelStep(draft, step)
      )
    },
    toggleSequence: (rank: number) => {
      updateBuild(identity, (draft) =>
        resonatorProgress.toggleSequence(draft, rank)
      )
    },
    setSkillLevel: (skillId: number, level: number) => {
      updateBuild(identity, (draft) =>
        resonatorProgress.setSkillLevel(draft, skillId, level)
      )
    },
    togglePassive: (id: number, enabled: boolean) => {
      updateBuild(identity, (draft) =>
        resonatorProgress.togglePassive(draft, id, enabled)
      )
    },
  }
}
