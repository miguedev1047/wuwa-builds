import { useSuspenseQuery } from "@tanstack/react-query"
import { Show } from "@/components/utility/show"
import { updateBuild } from "@builds/client/build-store"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WeaponSummary } from "@game-data/domain/weapon"
import { weaponQueries } from "@game-data/queries/weapons"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { WEAPON_REFINEMENT_RANKS } from "@game-data/application/constants/weapon"

type WeaponRefinementProps = {
  weapon: WeaponSummary
}

/** Refinement select and passive text of the selected weapon. */
export function WeaponRefinement({ weapon }: WeaponRefinementProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const { data: detail } = useSuspenseQuery(weaponQueries.detail(weapon.id))

  const rank = build?.weapon.refinament ?? 1
  const effect = detail.refinements[rank - 1]?.effect ?? ""

  const handleRankChange = (value: number | null) => {
    if (!value) return

    updateBuild(buildId, (draft) => {
      draft.weapon.refinament = value
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <Field>
      <FieldLabel htmlFor="select-refinement">
        Seleccionar refinamiento
      </FieldLabel>
      <Select
        id="select-refinement"
        value={rank}
        onValueChange={handleRankChange}
        items={WEAPON_REFINEMENT_RANKS}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WEAPON_REFINEMENT_RANKS.map((refinement) => (
            <SelectItem key={refinement.value} value={refinement.value}>
              {refinement.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Show when={effect}>
        {(text) => (
          <div
            className="px-3 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </Show>
    </Field>
  )
}
