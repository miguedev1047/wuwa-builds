import { PencilEdit01Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import type { EchoSkillRow } from "@db/schema"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSkillTextForm } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-text-form"

type EchoSkillTextActionProps = {
  echoId: number
  skill: EchoSkillRow | null
}

/** Opens the skill text dialog, prefilled from Encore when it is missing. */
export function EchoSkillTextAction({
  echoId,
  skill,
}: EchoSkillTextActionProps) {
  const body = ({ close }: { close: () => void }) => (
    <Suspense fallback={<Skeleton className="h-40 w-full" />}>
      <EchoSkillTextForm
        echoId={echoId}
        skill={skill}
        onSaved={close}
        onCancel={close}
      />
    </Suspense>
  )

  if (skill) {
    return (
      <EditableSection.EditAction
        title="Editar habilidad"
        trigger={
          <EditableSection.ButtonAction variant="default">
            <HugeiconsIcon icon={PencilEdit01Icon} />
            Editar texto
          </EditableSection.ButtonAction>
        }
      >
        {body}
      </EditableSection.EditAction>
    )
  }

  return (
    <EditableSection.AddAction
      title="Importar habilidad"
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Importar de Encore
        </EditableSection.ButtonAction>
      }
    >
      {body}
    </EditableSection.AddAction>
  )
}
