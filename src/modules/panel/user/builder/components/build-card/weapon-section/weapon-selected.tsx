import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { WeaponLevel } from "./weapon-level"
import { WeaponRefinement } from "./weapon-refinement"

/** Selected weapon summary and its editable level/refinement controls. */
export function WeaponSelected() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <Show when={build?.weapon.data}>
      {(weapon) => (
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-3">
            <Image
              src={weapon.icon}
              alt={weapon.name}
              size="sm"
              rounded="xl"
              background="accent"
              className="w-16"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{weapon.name}</p>
              <p className="text-xs text-muted-foreground">{weapon.typeName}</p>
            </div>
          </div>

          <SkeletonSuspense
            skeleton={<SkeletonBox width="100%" height={140} radius={0} />}
          >
            <WeaponLevel weapon={weapon} />
          </SkeletonSuspense>

          <SkeletonSuspense
            skeleton={<SkeletonBox width="100%" height={120} radius={0} />}
          >
            <WeaponRefinement weapon={weapon} />
          </SkeletonSuspense>
        </div>
      )}
    </Show>
  )
}
