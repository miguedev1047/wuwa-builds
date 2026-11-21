import { weaponProgress } from "@build/application/weapon-progress"
import type { LocalBuildIdentity } from "@build/client/build-store"
import { useBuildStore } from "@build/client/hooks/use-build-store"

/** Bind weapon progression to the current build. */
export function useWeaponProgress(identity: LocalBuildIdentity) {
  const { update } = useBuildStore(identity.userId)

  return {
    setLevelStep: (step: number) => {
      update(identity, (draft) => weaponProgress.setLevelStep(draft, step))
    },
    stepRefinement: (delta: number) => {
      update(identity, (draft) => weaponProgress.stepRefinement(draft, delta))
    },
  }
}
