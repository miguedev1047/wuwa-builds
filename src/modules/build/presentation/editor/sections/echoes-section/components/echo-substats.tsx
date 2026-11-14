import type { EchoesDataProps } from "@build/domain/build-record"
import {
  echoSubstatOptions,
  echoSubstatOptionsExcluding,
  type EchoSubstatOption,
} from "@build/application/echo-substats"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { EchoSubstatRow } from "@build/presentation/editor/sections/echoes-section/components/echo-substat-row"

type EchoSubstatsProps = {
  slot: EchoesDataProps
  onStatChange: (substatIndex: number, option: EchoSubstatOption) => void
  onValueChange: (substatIndex: number, value: number) => void
}

/** Five substat rows of one echo slot. */
export function EchoSubstats({
  slot,
  onStatChange,
  onValueChange,
}: EchoSubstatsProps) {
  const cost = slot.cost || slot.data?.cost || 0
  const options = echoSubstatOptions(cost)
  const substats = slot.substats

  const handleStatChange = (substatIndex: number, stat: string) => {
    const option = options.find((item) => item.stat === stat)

    if (option) onStatChange(substatIndex, option)
  }

  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Substats</BuildWorkspace.Text>

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
            onValueChange={(value) => onValueChange(substat.index, value)}
          />
        )
      })}
    </div>
  )
}
