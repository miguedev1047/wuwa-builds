import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EchoSubstatsDataProps } from "@/modules/builds/domain/build-record"
import {
  formatEchoSubstatValue,
  type EchoSubstatOption,
} from "@/modules/builds/application/echo-substats"

type EchoSubstatRowProps = {
  substat: EchoSubstatsDataProps
  options: EchoSubstatOption[]
  onStatChange: (stat: string) => void
  onValueChange: (value: number) => void
}

/** One substat row: stat select plus its roll value select. */
export function EchoSubstatRow({
  substat,
  options,
  onStatChange,
  onValueChange,
}: EchoSubstatRowProps) {
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
        <SelectTrigger className="flex-1" aria-label="Estadística del substat">
          <SelectValue placeholder="Substat" />
        </SelectTrigger>

        <SelectContent>
          {statOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={valueOptions}
        value={selectedValue}
        disabled={valueOptions.length === 0}
        onValueChange={(value) => {
          if (value) onValueChange(Number(value))
        }}
      >
        <SelectTrigger className="w-24" aria-label="Valor del substat">
          <SelectValue placeholder="Valor" />
        </SelectTrigger>

        <SelectContent>
          {valueOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
