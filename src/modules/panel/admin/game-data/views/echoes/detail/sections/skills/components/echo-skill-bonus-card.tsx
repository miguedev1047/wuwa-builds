import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import type { EchoSkillBonusRow } from "@/db/schema"
import { statLabel } from "@/modules/panel/admin/game-data/application/stats/stats"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { EchoSkillBonusConditionText } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-condition-text"
import { EchoSkillBonusDeleteAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-delete-action"
import { EchoSkillBonusEditAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-edit-action"

type EchoSkillBonusCardProps = {
  echoId: number
  bonus: EchoSkillBonusRow
}

/**
 * One curated bonus of the echo skill.
 *
 * Hierarchy: the stat and its value are the title, the condition is the
 * sentence below it, and the flags (`Ranura principal`, `No se suma`) are
 * badges so the eye reads them last.
 */
export function EchoSkillBonusCard({ echoId, bonus }: EchoSkillBonusCardProps) {
  return (
    <EditableSection.Item>
      <EditableSection.ItemContent>
        <EditableSection.ItemTitle>
          {statLabel(bonus.statId)}{" "}
          <span className="text-muted-foreground">+{bonus.value}%</span>
        </EditableSection.ItemTitle>

        <EditableSection.ItemDescription>
          <EchoSkillBonusConditionText bonus={bonus} />
        </EditableSection.ItemDescription>

        <Show when={bonus.requiresMainSlot || bonus.condition === "combat"}>
          <div className="flex flex-wrap items-center gap-1">
            <Show when={bonus.requiresMainSlot}>
              <Badge variant="outline">Ranura principal</Badge>
            </Show>

            <Show when={bonus.condition === "combat"}>
              <Badge variant="secondary">No se suma</Badge>
            </Show>
          </div>
        </Show>
      </EditableSection.ItemContent>

      <EditableSection.ItemActions>
        <EchoSkillBonusEditAction echoId={echoId} bonus={bonus} />
        <EchoSkillBonusDeleteAction echoId={echoId} bonus={bonus} />
      </EditableSection.ItemActions>
    </EditableSection.Item>
  )
}
