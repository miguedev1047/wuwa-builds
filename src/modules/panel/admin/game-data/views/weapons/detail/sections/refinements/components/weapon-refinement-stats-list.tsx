import type { WeaponRefinementStatRow } from "@/db/schema"
import { statLabel } from "@/modules/game-data/application/stats/stats"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponRefinementStatDeleteAction } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-delete-action"
import { WeaponRefinementStatEditAction } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-edit-action"

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
      className="grid md:grid-cols-2"
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
              <span className="tabular-nums">{stat.statNumber}</span>
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
