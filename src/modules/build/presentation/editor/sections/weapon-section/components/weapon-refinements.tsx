import { Button } from "@/components/ui/button"
import { Show } from "@/components/utility/show"
import { REFINEMENT_RANK_MAX, REFINEMENT_RANK_MIN } from "@build/domain/build"
import { MinusIcon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { WeaponDetail } from "@catalog/domain/weapon"
import { BuildWorkspace } from "@/modules/build/presentation/editor/components/workspace"

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <BuildWorkspace.Text size="sm">Refinamientos</BuildWorkspace.Text>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Bajar refinamiento"
            disabled={rank <= REFINEMENT_RANK_MIN}
            onClick={() => onStep(-1)}
          >
            <HugeiconsIcon icon={MinusIcon} />
          </Button>

          <div className="text-xs font-bold text-brand-warning tabular-nums">
            {rank}
          </div>

          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Subir refinamiento"
            disabled={rank >= REFINEMENT_RANK_MAX}
            onClick={() => onStep(1)}
          >
            <HugeiconsIcon icon={PlusIcon} />
          </Button>
        </div>
      </div>

      <Show when={effect}>
        {(text) => (
          <div
            className="text-xs/relaxed text-pretty text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </Show>
    </div>
  )
}
