import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { echoMainStatValue } from "@/modules/builds/application/echo-main-stat"
import { updateBuild } from "@/modules/builds/client/build-store"
import {
  ECHO_LEVEL_MAX,
  ECHO_LEVEL_MILESTONES,
  echoLevelFromStep,
  echoStepFromLevel,
} from "@/modules/builds/domain/build"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"

type EchoLevelProps = {
  slotIndex: number
}

/** Level slider of one echo slot. */
export function EchoLevel({ slotIndex }: EchoLevelProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const slot = build?.echoes.find((entry) => entry.index === slotIndex)
  const level = slot?.level ?? ECHO_LEVEL_MAX
  const step = echoStepFromLevel(level)

  const handleLevelChange = (value: number | readonly number[]) => {
    const nextStep = Array.isArray(value) ? value[0] : value

    if (typeof nextStep !== "number") return

    updateBuild(buildId, (draft) => {
      const target = draft.echoes.find((entry) => entry.index === slotIndex)

      if (!target) return

      target.level = echoLevelFromStep(nextStep)

      if (target.mainStatStat) {
        target.mainStatValue = echoMainStatValue({
          cost: target.cost,
          stat: target.mainStatStat,
          level: target.level,
        })
      }

      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Nivel del eco</p>
        <Badge variant="outline">Nv. {level}</Badge>
      </div>

      <Slider
        value={step}
        min={0}
        max={ECHO_LEVEL_MILESTONES.length - 1}
        onValueChange={handleLevelChange}
        aria-label={`Nivel del eco ${slotIndex + 1}`}
      />
    </section>
  )
}
