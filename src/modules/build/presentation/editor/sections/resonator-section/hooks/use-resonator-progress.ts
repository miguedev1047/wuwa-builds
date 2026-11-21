import { resonatorProgress } from "@build/application/resonator-progress"
import type { LocalBuildIdentity } from "@build/client/build-store"
import { useBuildStore } from "@build/client/hooks/use-build-store"

/** Bind resonator progression to the current build. */
export function useResonatorProgress(identity: LocalBuildIdentity) {
  const { update } = useBuildStore(identity.userId)

  return {
    setLevelStep: (step: number) => {
      update(identity, (draft) => resonatorProgress.setLevelStep(draft, step))
    },
    toggleSequence: (rank: number) => {
      update(identity, (draft) => resonatorProgress.toggleSequence(draft, rank))
    },
    setSkillLevel: (skillId: number, level: number) => {
      update(identity, (draft) =>
        resonatorProgress.setSkillLevel(draft, skillId, level)
      )
    },
    togglePassive: (id: number, enabled: boolean) => {
      update(identity, (draft) =>
        resonatorProgress.togglePassive(draft, id, enabled)
      )
    },
  }
}
