import {
  echoMainStatValue,
  type EchoMainStatOption,
} from "@builds/application/echo-main-stat"
import type { EchoSubstatOption } from "@builds/application/echo-substats"
import { updateBuild } from "@builds/client/build-store"
import { echoLevelFromStep } from "@builds/domain/build"

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

/**
 * Mutations of the echoes section.
 *
 * Handlers take the slot index instead of the rendered slot, so every write
 * reads the draft and never trusts a stale copy of the build.
 */
export function useEchoProgress(buildId: string): EchoProgress {
  const setLevelStep = (slotIndex: number, step: number) => {
    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)

      if (!target) return

      target.level = echoLevelFromStep(step)

      if (target.mainStatStat) {
        target.mainStatValue = echoMainStatValue({
          cost: target.cost,
          stat: target.mainStatStat,
          level: target.level,
        })
      }

      draft.updateAt = new Date().toISOString()
    })
  }

  const setSet = (slotIndex: number, setId: number) => {
    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)

      if (!target) return

      target.echoSetId = setId
      draft.updateAt = new Date().toISOString()
    })
  }

  const setMainStat = (slotIndex: number, option: EchoMainStatOption) => {
    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)

      if (!target) return

      target.mainStatStat = option.stat
      target.mainStatLabel = option.label
      target.mainStatValue = echoMainStatValue({
        cost: target.cost,
        stat: option.stat,
        level: target.level,
      })
      draft.updateAt = new Date().toISOString()
    })
  }

  const setSubstat = (
    slotIndex: number,
    substatIndex: number,
    option: EchoSubstatOption
  ) => {
    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)
      const substat = target?.substats.find(
        (entry) => entry.index === substatIndex
      )

      if (!substat) return

      substat.valueStat = option.stat
      substat.valueLabel = option.label
      substat.valueNumber = option.values[0] ?? 0
      draft.updateAt = new Date().toISOString()
    })
  }

  const setSubstatValue = (
    slotIndex: number,
    substatIndex: number,
    value: number
  ) => {
    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)
      const substat = target?.substats.find(
        (entry) => entry.index === substatIndex
      )

      if (!substat) return

      substat.valueNumber = value
      draft.updateAt = new Date().toISOString()
    })
  }

  const toggleMain = (slotIndex: number) => {
    updateBuild(buildId, (draft) => {
      draft.mainEchoSlot = draft.mainEchoSlot === slotIndex ? null : slotIndex
      draft.updateAt = new Date().toISOString()
    })
  }

  return {
    setLevelStep,
    setSet,
    setMainStat,
    setSubstat,
    setSubstatValue,
    toggleMain,
  }
}
