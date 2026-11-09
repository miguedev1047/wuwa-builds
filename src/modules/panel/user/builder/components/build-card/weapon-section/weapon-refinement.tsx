import { useSuspenseQuery } from "@tanstack/react-query"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import { updateBuild } from "@/modules/builds/client/build-store"
import { REFINEMENT_RANK_MAX } from "@/modules/builds/domain/build"
import type { WeaponSummary } from "@/modules/game-data/domain/weapon"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"

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

  const handleRankChange = (value: number | readonly number[]) => {
    const nextRank = Array.isArray(value) ? value[0] : value

    if (typeof nextRank !== "number") return

    updateBuild(buildId, (draft) => {
      draft.weapon.refinament = nextRank
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Refinamiento</p>
        <Badge variant="outline">R{rank}</Badge>
      </div>

      <Slider
        value={rank}
        min={1}
        max={REFINEMENT_RANK_MAX}
        onValueChange={handleRankChange}
      />

      <Show when={effect}>
        {(text) => (
          <div
            className="rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </Show>
    </section>
  )
}
