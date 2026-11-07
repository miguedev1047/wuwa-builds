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

  const handleLabelChange = (index: number, label: string) => {
    const option = options.find((item) => item.label === label)

    if (!option) return

    buildCollection.update(buildId, (current) => {
      const slot = current.echoes?.[echo.index]
      const substat = slot?.substats[index]

      if (!substat) return

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
        const selectedLabels = substats
          .filter((item) => item.index !== substat.index)
          .map((item) => item.valueLabel)

        const availableOptions = echoSubstatOptionsExcluding(
          options,
          selectedLabels,
          substat.valueLabel
        )

        return (
          <EchoSlotSubstatRow
            key={substat.index}
            substat={substat}
            options={availableOptions}
            onLabelChange={(label) => handleLabelChange(substat.index, label)}
            onValueChange={(value) => handleValueChange(substat.index, value)}
          />
        )
      })}
    </div>
  )
}
