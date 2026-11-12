import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Show } from "@/components/utility/show"
import {
  echoMainStatOptions,
  echoPrimaryStat,
  type EchoMainStatOption,
} from "@builds/application/echo-main-stat"
import type { EchoesDataProps } from "@builds/domain/build-record"

type EchoMainStatSelectProps = {
  slot: EchoesDataProps
  onChange: (option: EchoMainStatOption) => void
}

/** Main stat selector and base value of one echo slot. */
export function EchoMainStatSelect({
  slot,
  onChange,
}: EchoMainStatSelectProps) {
  const cost = slot.cost || slot.data?.cost || 0
  const options = echoMainStatOptions(cost)
  const primaryStat = echoPrimaryStat({ cost, level: slot.level })

  const selectedValue =
    slot.mainStatStat ||
    options.find((option) => option.label === slot.mainStatLabel)?.stat ||
    null

  const statOptions = options.map((option) => ({
    label: option.label,
    value: option.stat,
  }))

  const handleStatChange = (value: string | null) => {
    if (!value) return

    const option = options.find((item) => item.stat === value)

    if (option) onChange(option)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Estadística principal</p>

      <Select
        items={statOptions}
        value={selectedValue}
        disabled={statOptions.length === 0}
        onValueChange={handleStatChange}
      >
        <SelectTrigger
          className="w-full"
          aria-label="Estadística principal del eco"
        >
          <SelectValue placeholder="Selecciona una estadística" />
        </SelectTrigger>

        <SelectContent>
          {statOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-1">
                <GameIcon name={gameIconName(option.value)} />
                <p>{option.label}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap items-center gap-1">
        <Show when={primaryStat}>
          {(primary) => (
            <Badge variant="outline">
              Base: {primary.label} +{primary.value}
            </Badge>
          )}
        </Show>

        <Show when={slot.mainStatLabel}>
          {(label) => (
            <Badge variant="outline">
              {label} +{slot.mainStatValue}
            </Badge>
          )}
        </Show>
      </div>
    </div>
  )
}
