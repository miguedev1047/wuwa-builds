import { Show } from "@/components/utility/show"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"
import { REFINEMENT_RANK_MAX, REFINEMENT_RANK_MIN } from "@build/domain/build"
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
    <>
      <div className="space-y-2">
        <BuildWorkspace.Text size="sm">Refinamientos</BuildWorkspace.Text>

        <NumberField
          value={rank}
          max={REFINEMENT_RANK_MAX}
          min={REFINEMENT_RANK_MIN}
          onValueChange={(value) => {
            if (value !== null) onStep(value - rank)
          }}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </div>
      <div className="space-y-2">
        <BuildWorkspace.Text size="sm">Descripcion</BuildWorkspace.Text>
        <BuildWorkspace.Card cardColor="muted">
          <Show when={effect}>
            {(text) => (
              <div
                className="text-xs/relaxed text-pretty text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </Show>
        </BuildWorkspace.Card>
      </div>
    </>
  )
}
