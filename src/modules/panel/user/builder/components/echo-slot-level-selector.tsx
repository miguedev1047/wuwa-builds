import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  ECHO_LEVEL_MILESTONES,
  echoLevelFromStep,
  echoStepFromLevel,
} from "@/modules/builds/domain/build"
import { buildCollection } from "@/modules/builds/client/build-store"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import {
  echoMainStatOptions,
  echoMainStatValue,
} from "@/modules/panel/user/builder/application/echo-main-stat"

interface EchoSlotLevelSelectorProps {
  echo: EchoesDataProps
  buildId: string
}

/** Level slider for one echo slot: 0, 5, 10, 15, 20 and 25. */
export function EchoSlotLevelSelector({
  echo,
  buildId,
}: EchoSlotLevelSelectorProps) {
  const levelStep = echoStepFromLevel(echo.level)

  const handleLevelChange = (value: number | readonly number[]) => {
    const step = Array.isArray(value) ? value[0] : value

    if (typeof step !== "number") return

    const level = echoLevelFromStep(step)
    const cost = echo.cost || echo.data?.cost || 0

    buildCollection.update(buildId, (current) => {
      const slot = current.echoes?.[echo.index]

      if (!slot) return

      const stat =
        slot.mainStatStat ||
        echoMainStatOptions(cost).find(
          (option) => option.label === slot.mainStatLabel
        )?.stat ||
        ""

      slot.level = level
      slot.mainStatValue = echoMainStatValue({ cost, stat, level })
      current.updateAt = new Date().toISOString()
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Nivel</span>
        <Badge variant="outline">Nivel: {echo.level}</Badge>
      </div>

      <Slider
        min={0}
        max={ECHO_LEVEL_MILESTONES.length - 1}
        value={levelStep}
        onValueChange={handleLevelChange}
      />
    </div>
  )
}
