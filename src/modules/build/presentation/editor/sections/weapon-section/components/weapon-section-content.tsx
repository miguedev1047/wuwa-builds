import { useSuspenseQuery } from "@tanstack/react-query"
import { LEVEL_MILESTONES, stepFromLevel } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { useWeaponProgress } from "@build/presentation/editor/sections/weapon-section/hooks/use-weapon-progress"
import { WeaponLevelControl } from "@build/presentation/editor/sections/weapon-section/components/weapon-level-control"
import { WeaponPortrait } from "@build/presentation/editor/sections/weapon-section/components/weapon-portrait"
import { WeaponRefinements } from "@build/presentation/editor/sections/weapon-section/components/weapon-refinements"
import { weaponQueries } from "@catalog/queries/weapons"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { WeaponPickerDialog } from "@build/presentation/editor/sections/weapon-section/components/weapon-picker-dialog"

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
  const { setLevelStep, stepRefinement } = useWeaponProgress(build)

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <BuildWorkspace.Text family="bold" textColor="muted" size="xl">
          Arma
        </BuildWorkspace.Text>
        <WeaponPickerDialog build={build} />
      </div>

      <div className="flex h-full w-full flex-col justify-between gap-6">
        <WeaponPortrait build={build} weapon={weapon} />

        <WeaponLevelControl
          level={build.weapon.level}
          step={stepFromLevel(build.weapon.level)}
          maxStep={LEVEL_MILESTONES.length - 1}
          onStepChange={setLevelStep}
        />

        <WeaponRefinements
          refinements={weapon.refinements}
          rank={build.weapon.refinament}
          onStep={stepRefinement}
        />
      </div>
    </div>
  )
}
