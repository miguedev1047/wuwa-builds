import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Slider } from "@/components/ui/slider"
import { SKILL_LEVEL_MAX } from "@/modules/builds/domain/build"
import type { ResonatorSkillRow } from "@/db/schema"
import type { ResonatorSkillsDataProps } from "@/modules/builds/domain/build-record"

type SkillItemProps = {
  skill: ResonatorSkillsDataProps
  catalogSkill: Pick<ResonatorSkillRow, "name" | "type" | "icon">
  onLevelChange: (level: number) => void
}

/** One resonator skill with its level slider. */
export function SkillItem({
  skill,
  catalogSkill,
  onLevelChange,
}: SkillItemProps) {
  const handleLevelChange = (value: number | readonly number[]) => {
    const next = Array.isArray(value) ? value[0] : value

    if (typeof next === "number") onLevelChange(next)
  }

  return (
    <Item variant="muted">
      <ItemMedia variant="image">
        <img
          src={catalogSkill.icon}
          alt={catalogSkill.name}
          className="size-full object-contain"
        />
      </ItemMedia>

      <ItemContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <ItemTitle>{catalogSkill.name}</ItemTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline">{catalogSkill.type}</Badge>
            <Badge variant="outline">Nv. {skill.level}</Badge>
          </div>
        </div>

        <Slider
          min={1}
          max={SKILL_LEVEL_MAX}
          value={skill.level}
          onValueChange={handleLevelChange}
        />
      </ItemContent>
    </Item>
  )
}
