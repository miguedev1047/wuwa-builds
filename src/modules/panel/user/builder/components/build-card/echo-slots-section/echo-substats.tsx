import { updateBuild } from "@/modules/builds/client/build-store"
import {
  echoSubstatOptions,
  echoSubstatOptionsExcluding,
} from "@/modules/builds/application/echo-substats"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { EchoSubstatRow } from "./echo-substat-row"

type EchoSubstatsProps = {
  slotIndex: number
}

/** Five substat rows of one echo slot. */
export function EchoSubstats({ slotIndex }: EchoSubstatsProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const slot = build?.echoes.find((entry) => entry.index === slotIndex)
  const cost = slot?.cost || slot?.data?.cost || 0
  const options = echoSubstatOptions(cost)
  const substats = slot?.substats ?? []

  const handleStatChange = (index: number, stat: string) => {
    const option = options.find((item) => item.stat === stat)

    if (!option) return

    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)
      const substat = target?.substats[index]

      if (!substat) return

      substat.valueStat = option.stat
      substat.valueLabel = option.label
      substat.valueNumber = option.values[0] ?? 0
      draft.updateAt = new Date().toISOString()
    })
  }

  const handleValueChange = (index: number, value: number) => {
    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)
      const substat = target?.substats[index]

      if (!substat) return

      substat.valueNumber = value
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Substats</p>

      {substats.map((substat) => {
        const currentStat =
          substat.valueStat ||
          options.find((option) => option.label === substat.valueLabel)?.stat ||
          ""

        const selectedStats = substats
          .filter((item) => item.index !== substat.index)
          .map(
            (item) =>
              item.valueStat ||
              options.find((option) => option.label === item.valueLabel)
                ?.stat ||
              ""
          )

        const availableOptions = echoSubstatOptionsExcluding(
          options,
          selectedStats,
          currentStat
        )

        return (
          <EchoSubstatRow
            key={substat.index}
            substat={substat}
            options={availableOptions}
            onStatChange={(stat) => handleStatChange(substat.index, stat)}
            onValueChange={(value) => handleValueChange(substat.index, value)}
          />
        )
      })}
    </div>
  )
}
