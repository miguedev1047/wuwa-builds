import { Image } from "@/components/ui/image"
import { Slider } from "@/components/panelui/slider"
import { SKILL_LEVEL_MAX, SKILL_LEVEL_MIN } from "@build/domain/build"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

type ResonatorSkillNodeProps = {
  skill: Pick<CharacterDetail["skills"][number], "name" | "icon">
  level: number
  onLevelChange: (level: number) => void
}

/** One skill row: icon, skill name and its level slider. */
export function ResonatorSkillNode({
  skill,
  level,
  onLevelChange,
}: ResonatorSkillNodeProps) {
  return (
    <div className="flex items-end gap-2">
      <Image
        src={skill.icon}
        alt={skill.name}
        aspect="square"
        fit="contain"
        className="size-14 p-1"
        background="accent"
      />
      <div className="w-full space-y-1">
        <BuildWorkspace.Text
          size="xs"
          className="font-normal"
          uppercase={false}
          aria-label={skill.name}
          title={skill.name}
        >
          {skill.name}
        </BuildWorkspace.Text>
        <Slider
          value={level}
          min={SKILL_LEVEL_MIN}
          max={SKILL_LEVEL_MAX}
          step={1}
          format={(value) => `Lv. ${value}`}
          onValueChange={onLevelChange}
        />
      </div>
    </div>
  )
}
