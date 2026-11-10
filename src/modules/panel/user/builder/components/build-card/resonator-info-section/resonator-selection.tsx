import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import {
  normalizeElementId,
  normalizeWeaponTypeId,
} from "@builds/application/calculation/normalize"
import { BuildCard } from "@panel/user/builder/ui/build-card"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"

/** Summary of the resonator assigned to the build. */
export function ResonatorSelection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildCard className="bg-input/30 p-3">
      <Show
        when={build?.resonator.data}
        fallback={
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Sin resonador seleccionado</p>
            <p className="text-xs text-muted-foreground">Elige un resonador</p>
          </div>
        }
      >
        {(resonator) => {
          const element = gameIconName(normalizeElementId(resonator.element))
          const weaponType = gameIconName(
            normalizeWeaponTypeId(resonator.weaponType)
          )

          return (
            <div className="flex items-center gap-4">
              <Image
                src={resonator.icon}
                alt={resonator.name}
                size="sm"
                rounded="xl"
                background="accent"
                className="w-16"
              />
              <div className="flex w-full items-center justify-between">
                <p className="font-medium">{resonator.name}</p>
                <div className="flex items-center gap-2">
                  <GameIcon className="size-8" name={element} />
                  <GameIcon className="size-8" name={weaponType} />
                </div>
              </div>
            </div>
          )
        }}
      </Show>
    </BuildCard>
  )
}
