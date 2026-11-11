import { useSuspenseQuery } from "@tanstack/react-query"
import { LEVEL_MILESTONES, stepFromLevel } from "@builds/domain/build"
import type { BuildProps } from "@builds/domain/build-record"
import { Separator } from "@/components/ui/separator"
import { useWeaponProgress } from "@builder/sections/weapon-section/application/use-weapon-progress"
import { WeaponBaseStats } from "@builder/sections/weapon-section/components/weapon-base-stats"
import { WeaponIdentity } from "@builder/sections/weapon-section/components/weapon-identity"
import { WeaponLevelControl } from "@builder/sections/weapon-section/components/weapon-level-control"
import { WeaponPortrait } from "@builder/sections/weapon-section/components/weapon-portrait"
import { WeaponRefinements } from "@builder/sections/weapon-section/components/weapon-refinements"
import { weaponQueries } from "@game-data/queries/weapons"

type WeaponSectionContentProps = {
  build: BuildProps
  weaponId: number
}

/** Loaded weapon section: portrait, level, base stats and refinements. */
export function WeaponSectionContent({
  build,
  weaponId,
}: WeaponSectionContentProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))
  const { setLevelStep, stepRefinement } = useWeaponProgress(build.buildId)

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col items-start gap-4 md:flex-row">
        <WeaponPortrait weapon={weapon} />

        <div className="flex h-full w-full flex-col justify-between gap-6">
          <WeaponIdentity weapon={weapon} />

          <WeaponLevelControl
            level={build.weapon.level}
            step={stepFromLevel(build.weapon.level)}
            maxStep={LEVEL_MILESTONES.length - 1}
            onStepChange={setLevelStep}
          />

          <WeaponBaseStats
            properties={weapon.properties}
            level={build.weapon.level}
          />
        </div>
      </div>

      <Separator />

      <WeaponRefinements
        refinements={weapon.refinements}
        rank={build.weapon.refinament}
        onStep={stepRefinement}
      />
    </div>
  )
}
