import { SkeletonSuspense } from "skullet/react"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { WEAPON_LEVEL_MAX } from "@builds/domain/build"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"
import { WeaponInfoProperties } from "@builder/components/build-canvas/weapon-panel/weapon-info-properties"
import { WeaponInfoPropertiesSkeleton } from "@builder/components/build-canvas/weapon-panel/weapon-info-properties-skeleton"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/** Read-only card with the weapon of the build and its base stats. */
export function WeaponPanel() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const weapon = build?.weapon.data
  const level = build?.weapon.level ?? WEAPON_LEVEL_MAX

  return (
    <BuildCanvasCard area="weapon">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Arma
      </h2>

      <Show
        when={weapon}
        fallback={
          <Empty className="min-h-0 flex-1 border border-dashed">
            <EmptyTitle>Sin arma</EmptyTitle>
          </Empty>
        }
      >
        {(selected) => (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={selected.icon}
                alt={selected.name}
                size="sm"
                rounded="xl"
                background="accent"
                className="w-16 shrink-0"
              />

              <div className="min-w-0">
                <p className="truncate font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.typeName} · Nv. {level}
                </p>
              </div>
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
              <SkeletonSuspense skeleton={<WeaponInfoPropertiesSkeleton />}>
                <WeaponInfoProperties weapon={selected} level={level} />
              </SkeletonSuspense>
            </div>
          </div>
        )}
      </Show>
    </BuildCanvasCard>
  )
}
