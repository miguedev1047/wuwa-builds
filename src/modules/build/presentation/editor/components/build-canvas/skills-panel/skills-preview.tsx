import type { BuildProps } from "@build/domain/build-record"
import type { CharacterDetail } from "@catalog/domain/character"
import { createResonatorPassives } from "@build/application/factories/build"
import { Show } from "@/components/utility/show"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { SkillsBranch } from "@build/presentation/editor/components/build-canvas/skills-panel/skills-branch"

const PREVIEW_SKILLS = 5

/** Five skill branches with their saved passive states and upgrade levels. */
export function SkillsPreview({
  resonator,
  build,
}: {
  resonator: CharacterDetail
  build: BuildProps
}) {
  const skills = resonator.skills.slice(0, PREVIEW_SKILLS)
  const passives = createResonatorPassives(resonator).map((passive) => ({
    ...passive,
    enabled: build.resonator.passives.some(
      (saved) =>
        saved.passiveId === passive.passiveId &&
        saved.type === passive.type &&
        saved.enabled
    ),
  }))

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <BuildWorkspace.Text size="xs" textColor="muted" family="bold">
        Habilidades y pasivas
      </BuildWorkspace.Text>
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-3">
        <Show
          when={skills.length > 0}
          fallback={
            <p className="col-span-5 self-center text-center text-xs text-muted-foreground">
              Sin habilidades en el catálogo
            </p>
          }
        >
          {skills.map((skill, index) => (
            <SkillsBranch
              key={skill.skillId}
              skill={skill}
              level={
                build.resonator.skills.find(
                  (saved) => saved.skillId === skill.skillId
                )?.level
              }
              passives={[passives[index], passives[index + PREVIEW_SKILLS]]}
            />
          ))}
        </Show>
      </div>
    </div>
  )
}
