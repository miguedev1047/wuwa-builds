import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoSkillBonusForm } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-bonus-form"

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
        <Suspense fallback={<Skeleton className="h-50 w-full" />}>
          <EchoSkillBonusForm
            echoId={echoId}
            onSaved={close}
            onCancel={close}
          />
        </Suspense>
      )}
    </EditableSection.AddAction>
  )
}
