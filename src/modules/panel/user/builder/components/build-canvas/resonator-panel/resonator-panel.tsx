import type { BuildProps } from "@builds/domain/build-record"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"

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
            rounded="xl"
            background="glass"
            className="w-14 shrink-0"
          />
          <div>
            <h2 className="truncate text-lg font-bold uppercase">
              {resonator.name}
            </h2>
            <ul className="flex items-center">
              {Array.from({ length: resonator.rarity }).map((_, index) => (
                <li key={index}>
                  <HugeiconsIcon
                    icon={StarIcon}
                    className="size-4 text-brand-yellow"
                  />
                </li>
              ))}
            </ul>
          </div>
          <GameIcon
            className="ml-auto size-7 shrink-0"
            name={gameIconName(resonator.element)}
          />
        </BuildCanvasCard>
      )}
    </Show>
  )
}
