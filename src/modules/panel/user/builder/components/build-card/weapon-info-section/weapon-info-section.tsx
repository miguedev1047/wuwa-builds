import { SkeletonSuspense } from "skullet/react"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { WEAPON_LEVEL_MAX } from "@builds/domain/build"
import { useBuilderId } from "@builder/application/use-builder-id"
import { WeaponInfoProperties } from "@builder/components/build-card/weapon-info-section/weapon-info-properties"
import { WeaponInfoPropertiesSkeleton } from "@builder/components/build-card/weapon-info-section/weapon-info-properties-skeleton"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/** Read-only card with the weapon of the build and its base stats. */
export function WeaponInfoSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const weapon = build?.weapon.data
  const level = build?.weapon.level ?? WEAPON_LEVEL_MAX

  return (
    <BuildCardSection>
      <div className="flex h-full flex-col gap-3">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Arma
        </h2>

        <Show
          when={weapon}
          fallback={
            <Empty className="border border-dashed">
              <EmptyTitle>Sin arma</EmptyTitle>
            </Empty>
          }
        >
          {(selected) => (
            <div className="space-y-4">
              <div className="flex min-h-0 items-center gap-3">
                <Image
                  src={selected.icon}
                  alt={selected.name}
                  size="sm"
                  rounded="xl"
                  background="accent"
                  className="w-20"
                />

                <div className="min-w-0">
                  <p className="truncate text-lg font-medium">
                    {selected.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selected.typeName} · Nv. {level}
                  </p>
                </div>
              </div>

              <SkeletonSuspense skeleton={<WeaponInfoPropertiesSkeleton />}>
                <WeaponInfoProperties weapon={selected} level={level} />
              </SkeletonSuspense>
            </div>
          )}
        </Show>
      </div>
    </BuildCardSection>
  )
}
