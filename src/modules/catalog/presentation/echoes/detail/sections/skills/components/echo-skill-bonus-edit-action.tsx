import type { EchoSkillBonusRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSkillBonusForm } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-bonus-form"

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
        <Suspense fallback={<Skeleton className="h-50 w-full" />}>
          <EchoSkillBonusForm
            echoId={echoId}
            bonus={bonus}
            onSaved={close}
            onCancel={close}
          />
        </Suspense>
      )}
    </EditableSection.EditAction>
  )
}
