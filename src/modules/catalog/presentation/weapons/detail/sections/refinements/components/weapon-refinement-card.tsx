import { ChevronDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type {
  WeaponRefinementRow as WeaponRefinementRowData,
  WeaponRefinementStatRow,
} from "@db/schema"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementDeleteAction } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-delete-action"
import { WeaponRefinementEditAction } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-edit-action"
import { WeaponRefinementStatAddAction } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stat-add-action"
import { WeaponRefinementStatsList } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stats-list"

type WeaponRefinementCardProps = {
  refinement: WeaponRefinementRowData & {
    stats: WeaponRefinementStatRow[]
  }
  weaponId: number
}

/** Card of one weapon refinement with its effect and stats. */
export function WeaponRefinementCard({
  refinement,
  weaponId,
}: WeaponRefinementCardProps) {
  const sortOrder =
    refinement.stats.reduce((max, stat) => Math.max(max, stat.sortOrder), 0) + 1

  return (
    <EditableSection.Card>
      <EditableSection.CardHeader>
        <div className="flex min-w-0 flex-col gap-1">
          <EditableSection.CardTitle className="truncate">
            {refinement.name}
          </EditableSection.CardTitle>
          <EditableSection.CardDescription>
            Refinamiento {refinement.sortOrder}
          </EditableSection.CardDescription>
        </div>

        <EditableSection.CardAction className="flex items-center gap-1">
          <WeaponRefinementStatAddAction
            refinementId={refinement.id}
            weaponId={weaponId}
            sortOrder={sortOrder}
          />
          <WeaponRefinementEditAction refinement={refinement} />
          <WeaponRefinementDeleteAction
            refinementId={refinement.id}
            weaponId={weaponId}
          />
        </EditableSection.CardAction>
      </EditableSection.CardHeader>

      <EditableSection.CardContent className="space-y-4">
        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button variant="outline" className="w-full">
                <HugeiconsIcon icon={ChevronDownIcon} />
                Ver efecto
              </Button>
            }
          />
          <CollapsibleContent className="mt-4 px-2">
            <div
              className="text-xs/relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: refinement.effect }}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button variant="outline" className="w-full">
                <HugeiconsIcon icon={ChevronDownIcon} />
                Ver estadísticas
              </Button>
            }
          />
          <CollapsibleContent className="mt-4 px-2">
            <WeaponRefinementStatsList
              stats={refinement.stats}
              weaponId={weaponId}
            />
          </CollapsibleContent>
        </Collapsible>
      </EditableSection.CardContent>
    </EditableSection.Card>
  )
}
