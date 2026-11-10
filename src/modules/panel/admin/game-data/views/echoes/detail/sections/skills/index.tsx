import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { EchoSkillActions } from "@panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-actions"
import { EchoSkillContent } from "@panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-content"
import { EchoSkillSkeleton } from "@panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-skeleton"

/** Active skill of the echo: its text and the bonuses it grants. */
export function EchoSkillsSection() {
  const { id } = useParams({ from: "/(panel)/admin/echoes/$id" })
  const echoId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Habilidad del eco</EditableSection.Title>

        <EditableSection.Description>
          Texto de la habilidad activa y los bonos que otorga.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense skeleton={<SkeletonBox width={220} height={28} />}>
            <EchoSkillActions echoId={echoId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<EchoSkillSkeleton />}>
        <EchoSkillContent echoId={echoId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}
