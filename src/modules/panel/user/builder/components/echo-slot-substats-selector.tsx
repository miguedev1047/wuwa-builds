import { buildCollection } from "@/modules/builds/client/build-store"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import {
  echoSubstatOptions,
  echoSubstatOptionsExcluding,
} from "@/modules/panel/user/builder/application/echo-substats"
import { EchoSlotSubstatRow } from "@/modules/panel/user/builder/components/echo-slot-substat-row"

interface EchoSlotSubstatsSelectorProps {
  echo: EchoesDataProps
  buildId: string
}

/** Five substat rows for one echo slot. */
export function EchoSlotSubstatsSelector({
  echo,
  buildId,
}: EchoSlotSubstatsSelectorProps) {
  const cost = echo.cost || echo.data?.cost || 0
  const options = echoSubstatOptions(cost)
  const substats = echo.substats ?? []

  const handleStatChange = (index: number, stat: string) => {
    const option = options.find((item) => item.stat === stat)

    if (!option) return

    buildCollection.update(buildId, (current) => {
      const slot = current.echoes?.[echo.index]
      const substat = slot?.substats[index]

      if (!substat) return

      substat.valueStat = option.stat
      substat.valueLabel = option.label
      substat.valueNumber = option.values[0] ?? 0
      current.updateAt = new Date().toISOString()
    })
  }

  const handleValueChange = (index: number, value: number) => {
    buildCollection.update(buildId, (current) => {
      const slot = current.echoes?.[echo.index]
      const substat = slot?.substats[index]

      if (!substat) return

      substat.valueNumber = value
      current.updateAt = new Date().toISOString()
    })
  }

  return (
    <div className="space-y-2">
      <h2>Substats</h2>
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
          <EchoSlotSubstatRow
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
