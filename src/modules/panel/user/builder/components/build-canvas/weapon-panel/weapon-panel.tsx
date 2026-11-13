import type { BuildProps } from "@builds/domain/build-record"
import { Empty } from "@/components/ui/empty"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { WEAPON_LEVEL_MAX } from "@builds/domain/build"
import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"
import { BuildWorkspaceText } from "@builder/components/workspace/build-workspace"

/** Read-only card with the weapon of the build and its base stats. */
export function WeaponPanel({
  build,
  properties,
}: {
  build: BuildProps
  properties: React.ReactNode
}) {
  const noHasWeaponSelected = build.weapon.data
  const level = build.weapon.level ?? WEAPON_LEVEL_MAX

  return (
    <BuildCanvasCard area="weapon">
      <Show when={noHasWeaponSelected}>
        <BuildWorkspaceText size="xs" family="semibold" textColor="muted">
          Arma
        </BuildWorkspaceText>
      </Show>

      <Show
        when={noHasWeaponSelected}
        fallback={<Empty className="min-h-0 flex-1 border border-dashed" />}
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
              {properties}
            </div>
          </div>
        )}
      </Show>
    </BuildCanvasCard>
  )
}
