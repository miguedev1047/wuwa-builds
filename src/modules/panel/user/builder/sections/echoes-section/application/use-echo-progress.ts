import type { EchoMainStatOption } from "@builds/application/echo-main-stat"
import type { EchoSubstatOption } from "@builds/application/echo-substats"
import { echoProgress } from "@builds/application/echo-progress"
import {
  updateBuild,
  type LocalBuildIdentity,
} from "@builds/client/build-store"

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
  return {
    setLevelStep: (slotIndex: number, step: number) => {
      updateBuild(identity, (draft) =>
        echoProgress.setLevelStep(draft, slotIndex, step)
      )
    },
    setSet: (slotIndex: number, setId: number) => {
      updateBuild(identity, (draft) =>
        echoProgress.setSet(draft, slotIndex, setId)
      )
    },
    setMainStat: (slotIndex: number, option: EchoMainStatOption) => {
      updateBuild(identity, (draft) =>
        echoProgress.setMainStat(draft, slotIndex, option)
      )
    },
    setSubstat: (
      slotIndex: number,
      substatIndex: number,
      option: EchoSubstatOption
    ) => {
      updateBuild(identity, (draft) =>
        echoProgress.setSubstat(draft, slotIndex, substatIndex, option)
      )
    },
    setSubstatValue: (
      slotIndex: number,
      substatIndex: number,
      value: number
    ) => {
      updateBuild(identity, (draft) =>
        echoProgress.setSubstatValue(draft, slotIndex, substatIndex, value)
      )
    },
    toggleMain: (slotIndex: number) => {
      updateBuild(identity, (draft) =>
        echoProgress.toggleMain(draft, slotIndex)
      )
    },
  }
}
