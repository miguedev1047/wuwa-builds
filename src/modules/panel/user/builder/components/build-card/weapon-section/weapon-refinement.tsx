import { useSuspenseQuery } from "@tanstack/react-query"
import { Show } from "@/components/utility/show"
import { updateBuild } from "@/modules/builds/client/build-store"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WeaponSummary } from "@/modules/game-data/domain/weapon"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { WEAPON_REFINEMENT_RANKS } from "@/modules/game-data/application/constants/weapon"

type WeaponRefinementProps = {
  weapon: WeaponSummary
}

/** Refinement slider and passive text of the selected weapon. */
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
    <>
      <Field>
        <FieldLabel htmlFor="select-sequency">Seleccionar secuencia</FieldLabel>
        <Select
          id="select-sequency"
          value={rank}
          onValueChange={handleRankChange}
          items={WEAPON_REFINEMENT_RANKS}
        >
          <SelectTrigger>
            <SelectValue>
              {(value) => (
                <Show
                  when={value <= 0}
                  fallback={<span>Secuencia {value}</span>}
                >
                  <span>Sin secuencia activa</span>
                </Show>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {WEAPON_REFINEMENT_RANKS.map((sequency) => (
              <SelectItem key={sequency.value} value={sequency.value}>
                {sequency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          <Show when={effect}>
            {(text) => (
              <div
                className="px-3 pb-3 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </Show>
        </FieldDescription>
      </Field>
    </>
  )
}
