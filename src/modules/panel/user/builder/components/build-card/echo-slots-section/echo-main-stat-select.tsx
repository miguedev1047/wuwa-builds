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
  echoMainStatValue,
  echoPrimaryStat,
} from "@builds/application/echo-main-stat"
import { updateBuild } from "@builds/client/build-store"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { GameIcon } from "@/components/ui/game-icon"

type EchoMainStatSelectProps = {
  slotIndex: number
}

/** Main stat selector and base value of one echo slot. */
export function EchoMainStatSelect({ slotIndex }: EchoMainStatSelectProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const slot = build?.echoes.find((entry) => entry.index === slotIndex)
  const cost = slot?.cost || slot?.data?.cost || 0
  const level = slot?.level ?? 0
  const options = echoMainStatOptions(cost)
  const primaryStat = echoPrimaryStat({ cost, level })

  const selectedValue =
    slot?.mainStatStat ||
    options.find((option) => option.label === slot?.mainStatLabel)?.stat ||
    null

  const statOptions = options.map((option) => ({
    label: option.label,
    value: option.stat,
  }))

  const handleStatChange = (value: string | null) => {
    if (!value) return

    const option = options.find((item) => item.stat === value)

    if (!option) return

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
                <GameIcon name={option.value} />
                <p>{option.label}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap items-center gap-1">
        <Show when={primaryStat}>
          {(primary) => (
            <Badge variant="secondary">
              Base: {primary.label} +{primary.value}
            </Badge>
          )}
        </Show>

        <Show when={slot?.mainStatLabel}>
          {(label) => (
            <Badge variant="outline">
              {label} +{slot?.mainStatValue}
            </Badge>
          )}
        </Show>
      </div>
    </div>
  )
}
