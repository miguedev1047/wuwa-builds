import { Badge } from "@/components/panelui/badge"
import { Select } from "@/components/panelui/select"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { Show } from "@/components/utility/show"
import {
  echoMainStatOptions,
  echoPrimaryStat,
  type EchoMainStatOption,
} from "@build/application/echo-main-stat"
import type { EchoesDataProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

type EchoSlotMainStatSelectProps = {
  slot: EchoesDataProps
  onChange: (option: EchoMainStatOption) => void
}

/** Main stat selector and base value of one echo slot. */
export function EchoSlotMainStatSelect({
  slot,
  onChange,
}: EchoSlotMainStatSelectProps) {
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
      <BuildWorkspace.Text size="sm">Estadística principal</BuildWorkspace.Text>
      <Select
        items={statOptions}
        value={selectedValue}
        disabled={statOptions.length === 0}
        onValueChange={handleStatChange}
      >
        <Select.Trigger
          className="w-full"
          aria-label="Estadística principal del eco"
        >
          <Select.Value placeholder="Selecciona una estadística" />
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
