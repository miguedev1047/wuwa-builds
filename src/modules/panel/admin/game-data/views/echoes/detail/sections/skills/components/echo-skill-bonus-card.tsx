import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import type { EchoSkillBonusRow } from "@/db/schema"
import { echoSkillConditionLabel } from "@/modules/panel/admin/game-data/application/echoes/skills"
import { statLabel } from "@/modules/panel/admin/game-data/application/stats/stats"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import {
  RESONATOR_ELEMENTS,
  RESONATOR_WEAPON_TYPES,
} from "@/modules/panel/admin/game-data/views/resonators/shared/constants/resonator"
import { EchoSkillBonusDeleteAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-delete-action"
import { EchoSkillBonusEditAction } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-edit-action"
import { EchoSkillResonatorName } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-resonator-name"

type EchoSkillBonusCardProps = {
  echoId: number
  bonus: EchoSkillBonusRow
}

function optionText(
  options: readonly { label: string; value: string }[],
  value: string | null
): string {
  if (!value) return ""

  return options.find((option) => option.value === value)?.label ?? value
}

/** One curated bonus of the echo skill. */
export function EchoSkillBonusCard({ echoId, bonus }: EchoSkillBonusCardProps) {
  const condition = bonus.condition

  return (
    <EditableSection.Item>
      <ItemContent>
        <ItemTitle>
          {statLabel(bonus.statId)} +{bonus.value}%
        </ItemTitle>

        <ItemDescription className="flex flex-wrap items-center gap-1">
          <span>{echoSkillConditionLabel(condition)}</span>

          {condition === "resonator" && bonus.conditionValue ? (
            <span className="text-foreground">
              <SkeletonSuspense
                skeleton={<SkeletonBox width={70} height={12} />}
              >
                <EchoSkillResonatorName value={bonus.conditionValue} />
              </SkeletonSuspense>
            </span>
          ) : null}

          {condition === "element" && bonus.conditionValue ? (
            <span className="text-foreground">
              {optionText(RESONATOR_ELEMENTS, bonus.conditionValue)}
            </span>
          ) : null}

          {condition === "weaponType" && bonus.conditionValue ? (
            <span className="text-foreground">
              {optionText(RESONATOR_WEAPON_TYPES, bonus.conditionValue)}
            </span>
          ) : null}

          {bonus.requiresMainSlot ? (
            <Badge variant="outline">Ranura principal</Badge>
          ) : null}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <EchoSkillBonusEditAction echoId={echoId} bonus={bonus} />
        <EchoSkillBonusDeleteAction echoId={echoId} bonus={bonus} />
      </ItemActions>
    </EditableSection.Item>
  )
}
