import { Select } from "@/components/panelui/select"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import {
  formatEchoSubstatValue,
  type EchoSubstatOption,
} from "@build/application/echo-substats"
import type { EchoSubstatsDataProps } from "@build/domain/build-record"

type EchoSlotSubstatRowProps = {
  substat: EchoSubstatsDataProps
  options: EchoSubstatOption[]
  onStatChange: (stat: string) => void
  onValueChange: (value: number) => void
}

/** One substat row: stat select plus its roll value select. */
export function EchoSlotSubstatRow({
  substat,
  options,
  onStatChange,
  onValueChange,
}: EchoSlotSubstatRowProps) {
  const selectedStat =
    substat.valueStat ||
    options.find((option) => option.label === substat.valueLabel)?.stat ||
    null

  const selectedOption = options.find((option) => option.stat === selectedStat)
  const values = selectedOption?.values ?? []

  const statOptions = options.map((option) => ({
    label: option.label,
    value: option.stat,
  }))

  const valueOptions = values.map((value) => ({
    label: formatEchoSubstatValue(
      selectedOption?.label ?? substat.valueLabel,
      value
    ),
    value: String(value),
  }))

  const selectedValue = selectedStat ? String(substat.valueNumber) : null

  return (
    <div className="flex items-center gap-2">
      <Select
        items={statOptions}
        value={selectedStat}
        onValueChange={(value) => {
          if (value) onStatChange(value)
        }}
      >
        <Select.Trigger className="flex-1" aria-label="Estadística del substat">
          <Select.Value placeholder="Substat" />
        </Select.Trigger>

        <Select.Content>
          {statOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              <div className="flex items-center gap-1">
                <GameIcon name={gameIconName(option.value)} />
                <p>{option.label}</p>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <Select
        items={valueOptions}
        value={selectedValue}
        disabled={valueOptions.length === 0}
        onValueChange={(value) => {
          if (value) onValueChange(Number(value))
        }}
      >
        <Select.Trigger className="w-24" aria-label="Valor del substat">
          <Select.Value placeholder="Valor" />
        </Select.Trigger>

        <Select.Content>
          {valueOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}
