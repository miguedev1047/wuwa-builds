import { PencilEdit01Icon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import type { EchoSkillRow } from "@/db/schema"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { EchoSkillTextForm } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-text-form"

type EchoSkillTextActionProps = {
  echoId: number
  skill: EchoSkillRow | null
}

/** Opens the skill text dialog, prefilled from Encore when it is missing. */
export function EchoSkillTextAction({
  echoId,
  skill,
}: EchoSkillTextActionProps) {
  const trigger = (
    <EditableSection.ButtonAction variant="default">
      <HugeiconsIcon icon={skill ? PencilEdit01Icon : PlusIcon} />
      {skill ? "Editar texto" : "Importar de Encore"}
    </EditableSection.ButtonAction>
  )

  const body = ({ close }: { close: () => void }) => (
    <SkeletonSuspense skeleton={<SkeletonBox width="100%" height={160} />}>
      <EchoSkillTextForm
        echoId={echoId}
        skill={skill}
        onSaved={close}
        onCancel={close}
      />
    </SkeletonSuspense>
  )

  if (skill) {
    return (
      <EditableSection.EditAction title="Editar habilidad" trigger={trigger}>
        {body}
      </EditableSection.EditAction>
    )
  }

  return (
    <EditableSection.AddAction title="Importar habilidad" trigger={trigger}>
      {body}
    </EditableSection.AddAction>
  )
}
