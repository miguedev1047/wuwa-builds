import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Show } from "@/components/utility/show"
import { buildCollection } from "@/modules/builds/client/build-store"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import {
  echoMainStatOptions,
  echoMainStatValue,
} from "@/modules/panel/user/builder/application/echo-main-stat"

interface EchoSlotMainStatSelectorProps {
  echo: EchoesDataProps
  buildId: string
}

/** Main stat selector for one echo slot. */
export function EchoSlotMainStatSelector({
  echo,
  buildId,
}: EchoSlotMainStatSelectorProps) {
  const cost = echo.cost || echo.data?.cost || 0
  const options = echoMainStatOptions(cost)

  const mainStatsOptions = options.map((option) => ({
    label: option.label,
    value: option.stat,
  }))

  const selectedValue =
    options.find((option) => option.label === echo.mainStatLabel)?.stat ?? null

  const handleValueChange = (value: string | null) => {
    if (value === null) return

    const option = options.find((item) => item.stat === value)

    if (!option) return

    buildCollection.update(buildId, (current) => {
      const slot = current.echoes?.[echo.index]

      if (!slot) return

      slot.mainStatLabel = option.label
      slot.mainStatValue = echoMainStatValue({
        cost,
        label: option.label,
        level: echo.level,
      })
      current.updateAt = new Date().toISOString()
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-4">
        <Select
          items={mainStatsOptions}
          value={selectedValue}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una estadistica" />
          </SelectTrigger>

          <SelectContent>
            {mainStatsOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Show when={echo.mainStatLabel}>
          <Badge variant="outline" className="h-7">
            {echo.mainStatLabel} +{echo.mainStatValue}
          </Badge>
        </Show>
      </div>
    </div>
  )
}
