import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSkillAddLoader } from "@catalog/presentation/resonators/detail/sections/skills/components/resonator-skill-add-loader"
import { ResonatorSkillsContent } from "@catalog/presentation/resonators/detail/sections/skills/components/resonator-skills-content"
import { ResonatorSkillsSkeleton } from "@catalog/presentation/resonators/detail/sections/skills/components/resonator-skills-skeleton"

/** Skills (`resonator_skills`) of the resonator. */
export function ResonatorSkillsSection({
  resonatorId,
}: {
  resonatorId: number
}) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Habilidades</EditableSection.Title>
        <EditableSection.Description>
          Habilidades del resonador y sus descripciones.
        </EditableSection.Description>

        <EditableSection.Action>
          <Suspense fallback={<Skeleton className="h-8 w-36" />}>
            <ResonatorSkillAddLoader resonatorId={resonatorId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<ResonatorSkillsSkeleton />}>
        <ResonatorSkillsContent resonatorId={resonatorId} />
      </Suspense>
    </EditableSection.Root>
  )
}
