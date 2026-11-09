import { useSuspenseQuery } from "@tanstack/react-query"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { updateBuild } from "@/modules/builds/client/build-store"
import {
  LEVEL_MILESTONES,
  levelFromStep,
  stepFromLevel,
  WEAPON_LEVEL_MAX,
} from "@/modules/builds/domain/build"
import type { WeaponSummary } from "@/modules/game-data/domain/weapon"
import { growthValueAtLevel } from "@/modules/game-data/domain/character"
import { statLabel } from "@/modules/game-data/application/stats/stats"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"

type WeaponLevelProps = {
  weapon: WeaponSummary
}

/** Level slider and base properties of the selected weapon. */
export function WeaponLevel({ weapon }: WeaponLevelProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const { data: detail } = useSuspenseQuery(weaponQueries.detail(weapon.id))

  const level = build?.weapon.level ?? WEAPON_LEVEL_MAX
  const step = stepFromLevel(level)

  const handleLevelChange = (value: number | readonly number[]) => {
    const nextStep = Array.isArray(value) ? value[0] : value

    if (typeof nextStep !== "number") return

    updateBuild(buildId, (draft) => {
      draft.weapon.level = levelFromStep(nextStep)
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Nivel del arma</p>
        <Badge variant="outline">Nv. {level}</Badge>
      </div>

      <Slider
        value={step}
        min={0}
        max={LEVEL_MILESTONES.length - 1}
        onValueChange={handleLevelChange}
      />

      <div className="grid gap-1 sm:grid-cols-2">
        {detail.properties.map((property) => (
          <div
            key={property.name}
            className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-xs"
          >
            <span className="text-muted-foreground">
              {statLabel(property.name)}
            </span>
            <span className="font-medium tabular-nums">
              {growthValueAtLevel(property.growth, level)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
