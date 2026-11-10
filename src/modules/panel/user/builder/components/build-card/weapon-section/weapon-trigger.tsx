import { SkeletonSuspense } from "skullet/react"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { WEAPON_LEVEL_MAX } from "@builds/domain/build"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { WeaponProperties } from "@builder/components/build-card/weapon-section/weapon-properties"
import { WeaponPropertiesSkeleton } from "@builder/components/build-card/weapon-section/weapon-properties-skeleton"
import { Empty, EmptyTitle } from "@/components/ui/empty"

/** Card that shows the selected weapon, its level and its base stats. */
export function WeaponTrigger() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const weapon = build?.weapon.data
  const level = build?.weapon.level ?? WEAPON_LEVEL_MAX

  return (
    <BuildCardSection interactive>
      <div className="flex h-full flex-col gap-3">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Arma
        </h2>
        <Show
          when={weapon}
          fallback={
            <Empty className="border border-dashed">
              <EmptyTitle className="text-sm text-muted-foreground">
                Seleccionar arma
              </EmptyTitle>
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

              <SkeletonSuspense skeleton={<WeaponPropertiesSkeleton />}>
                <WeaponProperties weapon={selected} level={level} />
              </SkeletonSuspense>
            </div>
          )}
        </Show>
      </div>
    </BuildCardSection>
  )
}
