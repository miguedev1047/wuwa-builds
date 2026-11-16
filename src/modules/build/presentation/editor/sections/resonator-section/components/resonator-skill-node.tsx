import { Image } from "@/components/ui/image"
import { Slider } from "@/components/panelui/slider"
import { SKILL_LEVEL_MAX, SKILL_LEVEL_MIN } from "@build/domain/build"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ResonatorSkillCardPreview } from "@build/presentation/editor/sections/resonator-section/components/resonator-skill-card-preview"

type ResonatorSkillNodeProps = {
  skill: CharacterDetail["skills"][number]
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
      <HoverCard>
        <HoverCardTrigger
          render={
            <BuildWorkspace.Card
              cardColor="input"
              className="relative size-14 shrink-0 p-1"
            >
              <Image
                src={skill.icon}
                alt={skill.name}
                className="size-full object-contain"
              />
            </BuildWorkspace.Card>
          }
        />
        <HoverCardContent className="no-scrollbar max-h-100 w-200 scroll-fade-y overflow-y-scroll">
          <ResonatorSkillCardPreview skill={skill} />
        </HoverCardContent>
      </HoverCard>

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
