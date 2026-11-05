import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { EchoSkillBonusForm } from "@/modules/panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-form"

type EchoSkillBonusAddActionProps = {
  echoId: number
}

export function EchoSkillBonusAddAction({
  echoId,
}: EchoSkillBonusAddActionProps) {
  return (
    <EditableSection.AddAction
      title="Agregar bono"
      description="Estadística que otorga la habilidad y cuándo aplica."
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Bono
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <SkeletonSuspense skeleton={<SkeletonBox width="100%" height={200} />}>
          <EchoSkillBonusForm
            echoId={echoId}
            onSaved={close}
            onCancel={close}
          />
        </SkeletonSuspense>
      )}
    </EditableSection.AddAction>
  )
}
