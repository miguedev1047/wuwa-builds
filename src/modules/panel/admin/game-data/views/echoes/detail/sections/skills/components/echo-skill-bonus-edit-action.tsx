import type { EchoSkillBonusRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { EchoSkillBonusForm } from "@panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-form"

type EchoSkillBonusEditActionProps = {
  echoId: number
  bonus: EchoSkillBonusRow
}

export function EchoSkillBonusEditAction({
  echoId,
  bonus,
}: EchoSkillBonusEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar bono"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Editar bono"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <SkeletonSuspense skeleton={<SkeletonBox width="100%" height={200} />}>
          <EchoSkillBonusForm
            echoId={echoId}
            bonus={bonus}
            onSaved={close}
            onCancel={close}
          />
        </SkeletonSuspense>
      )}
    </EditableSection.EditAction>
  )
}
