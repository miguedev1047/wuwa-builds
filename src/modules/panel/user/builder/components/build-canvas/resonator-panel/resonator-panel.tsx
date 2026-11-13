import type { BuildProps } from "@builds/domain/build-record"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"

/** Read-only card with the resonator portrait, name and element. */
export function ResonatorPanel({ build }: { build: BuildProps }) {
  return (
    <Show when={build.resonator.data}>
      {(resonator) => (
        <BuildCanvasCard
          area="resonator"
          className="flex-row items-center gap-3"
        >
          <Image
            src={resonator.iconLarge}
            alt={resonator.name}
            aspect="square"
            rounded="full"
            background="accent"
            size="xs"
            className="size-12 shrink-0"
          />
          <h2 className="truncate text-lg font-bold uppercase">
            {resonator.name}
          </h2>
          <GameIcon
            className="ml-auto size-7 shrink-0"
            name={gameIconName(resonator.element)}
          />
        </BuildCanvasCard>
      )}
    </Show>
  )
}
