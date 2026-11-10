import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { Show } from "@/components/utility/show"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { WeaponLevel } from "./weapon-level"
import { WeaponRefinement } from "./weapon-refinement"
import { FieldGroup } from "@/components/ui/field"

/** Level and refinement controls of the selected weapon. */
export function WeaponControls() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <Show when={build?.weapon.data}>
      {(weapon) => (
        <FieldGroup>
          <WeaponLevel />

          <SkeletonSuspense
            skeleton={<SkeletonBox width="100%" height={120} radius={0} />}
          >
            <WeaponRefinement weapon={weapon} />
          </SkeletonSuspense>
        </FieldGroup>
      )}
    </Show>
  )
}
