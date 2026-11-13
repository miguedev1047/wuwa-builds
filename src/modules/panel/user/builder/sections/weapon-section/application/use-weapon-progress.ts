import { weaponProgress } from "@builds/application/weapon-progress"
import {
  updateBuild,
  type LocalBuildIdentity,
} from "@builds/client/build-store"

/** Bind weapon progression to the current local build. */
export function useWeaponProgress(identity: LocalBuildIdentity) {
  return {
    setLevelStep: (step: number) => {
      updateBuild(identity, (draft) => weaponProgress.setLevelStep(draft, step))
    },
    stepRefinement: (delta: number) => {
      updateBuild(identity, (draft) =>
        weaponProgress.stepRefinement(draft, delta)
      )
    },
  }
}
