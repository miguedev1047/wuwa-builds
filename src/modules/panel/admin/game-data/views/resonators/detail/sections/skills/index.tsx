import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorSkillAddLoader } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-add-loader"
import { ResonatorSkillsContent } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skills-content"
import { ResonatorSkillsSkeleton } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skills-skeleton"

/** Skills (`resonator_skills`) of the resonator. */
export function ResonatorSkillsSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Habilidades</EditableSection.Title>
        <EditableSection.Description>
          Habilidades del resonador y sus descripciones.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense skeleton={<SkeletonBox width="9rem" height={32} />}>
            <ResonatorSkillAddLoader resonatorId={resonatorId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<ResonatorSkillsSkeleton />}>
        <ResonatorSkillsContent resonatorId={resonatorId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
