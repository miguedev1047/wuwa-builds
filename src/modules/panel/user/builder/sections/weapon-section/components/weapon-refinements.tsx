import { Button } from "@/components/ui/button"
import { Show } from "@/components/utility/show"
import { REFINEMENT_RANK_MAX, REFINEMENT_RANK_MIN } from "@builds/domain/build"
import { MinusIcon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { WeaponDetail } from "@game-data/domain/weapon"

type WeaponRefinementsProps = {
  refinements: WeaponDetail["refinements"]
  /** 1-based refinement rank of the build. */
  rank: number
  /** Moves the rank by one step; the store clamps the result. */
  onStep: (delta: number) => void
}

/** Refinement stepper with the passive text of the active rank. */
export function WeaponRefinements({
  refinements,
  rank,
  onStep,
}: WeaponRefinementsProps) {
  const effect = refinements[rank - 1]?.effect

  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex shrink-0 items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Bajar refinamiento"
          disabled={rank <= REFINEMENT_RANK_MIN}
          onClick={() => onStep(-1)}
        >
          <HugeiconsIcon icon={MinusIcon} />
        </Button>

        <div className="text-brand-warning tabular-nums">{rank}</div>

        <Button
          variant="outline"
          size="icon"
          aria-label="Subir refinamiento"
          disabled={rank >= REFINEMENT_RANK_MAX}
          onClick={() => onStep(1)}
        >
          <HugeiconsIcon icon={PlusIcon} />
        </Button>
      </div>

      <Show when={effect}>
        {(text) => (
          <div
            className="text-sm/relaxed text-muted-foreground max-sm:max-w-100"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </Show>
    </div>
  )
}
