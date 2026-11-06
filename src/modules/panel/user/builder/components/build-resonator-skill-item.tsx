import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import type { ResonatorSkillRow } from "@/db/schema"
import type { ResonatorSkillsDataProps } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { BuildResonatorSkillLevel } from "@/modules/panel/user/builder/components/build-resonator-skill-level"

interface BuildResonatorSkillItemProps {
  skill: ResonatorSkillsDataProps
  resonatorSkill: Pick<ResonatorSkillRow, "icon" | "name" | "type">
  onLevelChange: (level: number) => void
}

/** One skill row: catalog identity, current level and its slider. */
export function BuildResonatorSkillItem({
  skill,
  resonatorSkill,
  onLevelChange,
}: BuildResonatorSkillItemProps) {
  return (
    <Item variant="muted">
      <ItemMedia variant="image">
        <img src={resonatorSkill.icon} alt={resonatorSkill.name} />
      </ItemMedia>

      <ItemContent>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between">
            <ItemTitle>{resonatorSkill.name}</ItemTitle>

            <div className="flex items-center gap-1">
              <Badge variant="outline">{resonatorSkill.type}</Badge>
              <Badge variant="outline">{skill.level}</Badge>
            </div>
          </div>

          <BuildResonatorSkillLevel
            level={skill.level}
            onLevelChange={onLevelChange}
          />
        </div>
      </ItemContent>
    </Item>
  )
}
