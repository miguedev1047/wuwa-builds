import {
  echoMainStatValue,
  type EchoMainStatOption,
} from "@build/application/echo-main-stat"
import type { EchoSubstatOption } from "@build/application/echo-substats"
import { echoLevelFromStep } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"

/** Apply echo progression to the current build draft. */
export const echoProgress = {
  setLevelStep(draft: BuildProps, slotIndex: number, step: number) {
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
  },

  setSet(draft: BuildProps, slotIndex: number, setId: number) {
    const target = draft.echoes.find((entry) => entry.index === slotIndex)

    if (!target) return

    target.echoSetId = setId
    draft.updateAt = new Date().toISOString()
  },

  setMainStat(
    draft: BuildProps,
    slotIndex: number,
    option: EchoMainStatOption
  ) {
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
  },

  setSubstat(
    draft: BuildProps,
    slotIndex: number,
    substatIndex: number,
    option: EchoSubstatOption
  ) {
    const target = draft.echoes.find((entry) => entry.index === slotIndex)
    const substat = target?.substats.find(
      (entry) => entry.index === substatIndex
    )

    if (!substat) return

    substat.valueStat = option.stat
    substat.valueLabel = option.label
    substat.valueNumber = option.values[0] ?? 0
    draft.updateAt = new Date().toISOString()
  },

  setSubstatValue(
    draft: BuildProps,
    slotIndex: number,
    substatIndex: number,
    value: number
  ) {
    const target = draft.echoes.find((entry) => entry.index === slotIndex)
    const substat = target?.substats.find(
      (entry) => entry.index === substatIndex
    )

    if (!substat) return

    substat.valueNumber = value
    draft.updateAt = new Date().toISOString()
  },

  toggleMain(draft: BuildProps, slotIndex: number) {
    draft.mainEchoSlot = draft.mainEchoSlot === slotIndex ? null : slotIndex
    draft.updateAt = new Date().toISOString()
  },
}
