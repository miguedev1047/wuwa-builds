import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSkillActions } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-actions"
import { EchoSkillContent } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-content"
import { EchoSkillSkeleton } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-skeleton"

/** Active skill of the echo: its text and the bonuses it grants. */
export function EchoSkillsSection({ echoId }: { echoId: number }) {
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
