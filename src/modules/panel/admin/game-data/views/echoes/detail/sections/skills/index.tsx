import { useParams } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
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
          <Suspense fallback={<Skeleton className="h-7 w-55" />}>
            <EchoSkillActions echoId={echoId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<EchoSkillSkeleton />}>
        <EchoSkillContent echoId={echoId} />
      </Suspense>
    </EditableSection.Root>
  )
}
