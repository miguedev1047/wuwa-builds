import type { BuildProps } from "@build/domain/build-record"
import { Empty } from "@/components/ui/empty"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { WEAPON_LEVEL_MAX } from "@build/domain/build"
import { BuildCanvasCard } from "@build/presentation/editor/components/build-canvas/build-canvas-card"
import { Badge } from "@/components/ui/badge"

/** Read-only card with the weapon of the build and its base stats. */
export function WeaponPanel({
  build,
  properties,
}: {
  build: BuildProps
  properties: React.ReactNode
}) {
  const noHasWeaponSelected = build.weapon.data
  const refinament = build.weapon.refinament
  const level = build.weapon.level ?? WEAPON_LEVEL_MAX

  return (
    <BuildCanvasCard area="weapon">
      <Show
        when={noHasWeaponSelected}
        fallback={<Empty className="min-h-0 flex-1 border border-dashed" />}
      >
        {(weapon) => (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 space-y-2 pl-4">
                <h2 className="truncate font-extrabold">{weapon.name}</h2>
                <p className="text-xs">Nv. {level}/90</p>
                <Badge variant="outline">Refinamiento {refinament}</Badge>
              </div>

              <Image
                src={weapon.icon}
                alt={weapon.name}
                aspect="square"
                rounded="xl"
                background="glass"
                className="w-24 shrink-0"
              />
            </div>
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
              {properties}
            </div>
          </div>
        )}
      </Show>
    </BuildCanvasCard>
  )
}
