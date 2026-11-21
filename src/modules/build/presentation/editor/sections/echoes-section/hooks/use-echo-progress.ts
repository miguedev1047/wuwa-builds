import type { EchoMainStatOption } from "@build/application/echo-main-stat"
import type { EchoSubstatOption } from "@build/application/echo-substats"
import { echoProgress } from "@build/application/echo-progress"
import type { LocalBuildIdentity } from "@build/client/build-store"
import { useBuildStore } from "@build/client/hooks/use-build-store"

/** Mutations of the echoes section, addressed by slot index. */
export interface EchoProgress {
  setLevelStep: (slotIndex: number, step: number) => void
  setSet: (slotIndex: number, setId: number) => void
  setMainStat: (slotIndex: number, option: EchoMainStatOption) => void
  setSubstat: (
    slotIndex: number,
    substatIndex: number,
    option: EchoSubstatOption
  ) => void
  setSubstatValue: (
    slotIndex: number,
    substatIndex: number,
    value: number
  ) => void
  toggleMain: (slotIndex: number) => void
}

/** Bind echo progression to the current local build. */
export function useEchoProgress(identity: LocalBuildIdentity): EchoProgress {
  const { update } = useBuildStore(identity.userId)

  return {
    setLevelStep: (slotIndex: number, step: number) => {
      update(identity, (draft) =>
        echoProgress.setLevelStep(draft, slotIndex, step)
      )
    },
    setSet: (slotIndex: number, setId: number) => {
      update(identity, (draft) =>
        echoProgress.setSet(draft, slotIndex, setId)
      )
    },
    setMainStat: (slotIndex: number, option: EchoMainStatOption) => {
      update(identity, (draft) =>
        echoProgress.setMainStat(draft, slotIndex, option)
      )
    },
    setSubstat: (
      slotIndex: number,
      substatIndex: number,
      option: EchoSubstatOption
    ) => {
      update(identity, (draft) =>
        echoProgress.setSubstat(draft, slotIndex, substatIndex, option)
      )
    },
    setSubstatValue: (
      slotIndex: number,
      substatIndex: number,
      value: number
    ) => {
      update(identity, (draft) =>
        echoProgress.setSubstatValue(draft, slotIndex, substatIndex, value)
      )
    },
    toggleMain: (slotIndex: number) => {
      update(identity, (draft) =>
        echoProgress.toggleMain(draft, slotIndex)
      )
    },
  }
}
