import type { WeaponRefinementStatRow } from "@db/schema"
import { statLabel } from "@catalog/application/stats/stats"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementStatDeleteAction } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stat-delete-action"
import { WeaponRefinementStatEditAction } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stat-edit-action"
import { formatPercentStat } from "@/modules/build/presentation/editor/hooks/stats-view-model"

type WeaponRefinementStatsListProps = {
  stats: WeaponRefinementStatRow[]
  weaponId: number
}

/** Stats granted by a refinement, each one editable and deletable. */
export function WeaponRefinementStatsList({
  stats,
  weaponId,
}: WeaponRefinementStatsListProps) {
  return (
    <EditableSection.List
      className="grid"
      items={stats}
      getItemKey={(stat) => stat.id}
      empty={
        <EditableSection.Text>Sin estadísticas agregadas.</EditableSection.Text>
      }
    >
      {(stat) => (
        <EditableSection.Item size="sm">
          <EditableSection.ItemContent>
            <EditableSection.ItemTitle>
              {statLabel(stat.statName)}
            </EditableSection.ItemTitle>
            <EditableSection.ItemDescription>
              <span className="tabular-nums">
                {formatPercentStat(stat.statNumber)}
              </span>
            </EditableSection.ItemDescription>
          </EditableSection.ItemContent>

          <EditableSection.ItemActions>
            <WeaponRefinementStatEditAction stat={stat} weaponId={weaponId} />
            <WeaponRefinementStatDeleteAction
              statId={stat.id}
              weaponId={weaponId}
            />
          </EditableSection.ItemActions>
        </EditableSection.Item>
      )}
    </EditableSection.List>
  )
}
