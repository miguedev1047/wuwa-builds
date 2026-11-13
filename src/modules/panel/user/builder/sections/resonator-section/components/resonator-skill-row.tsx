import { Image } from "@/components/ui/image"
import { Item, ItemContent } from "@/components/ui/item"
import { Slider } from "@/components/panelui/slider"
import { SKILL_LEVEL_MAX, SKILL_LEVEL_MIN } from "@builds/domain/build"
import type { CharacterDetail } from "@game-data/domain/character"

type ResonatorSkillRowProps = {
  skill: Pick<CharacterDetail["skills"][number], "name" | "icon">
  level: number
  onLevelChange: (level: number) => void
}

/** One skill row: icon, skill name and its level slider. */
export function ResonatorSkillRow({
  skill,
  level,
  onLevelChange,
}: ResonatorSkillRowProps) {
  return (
    <Item variant="outline" size="sm">
      <Image
        src={skill.icon}
        alt={skill.name}
        aspect="square"
        size="xs"
        fit="contain"
        background="accent"
      />
      <ItemContent>
        <Slider
          label={skill.name}
          value={level}
          min={SKILL_LEVEL_MIN}
          max={SKILL_LEVEL_MAX}
          step={1}
          format={(value) => `Lv. ${value}`}
          onValueChange={onLevelChange}
        />
      </ItemContent>
    </Item>
  )
}
