import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { useBuilderId } from "@builder/application/use-builder-id"
import { Show } from "@/components/utility/show"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"

/** Read-only card with the resonator portrait, name and element. */
export function ResonatorPanel() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <Show when={build?.resonator.data}>
      {(resonator) => (
        <BuildCardSection className="relative h-full p-0">
          <div className="flex items-center gap-4 pr-4">
            <img
              src={resonator.iconLarge}
              alt={resonator.name}
              className="h-15 mask-r-from-90%"
            />
            <h2 className="text-xl font-bold uppercase">{resonator.name}</h2>

            <div className="ml-auto">
              <GameIcon
                className="size-8"
                name={gameIconName(resonator.element)}
              />
            </div>
          </div>
        </BuildCardSection>
      )}
    </Show>
  )
}
