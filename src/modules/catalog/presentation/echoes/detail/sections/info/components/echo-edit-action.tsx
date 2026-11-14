import { Show } from "@/components/utility/show"
import type { EchoRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoEditForm } from "@catalog/presentation/echoes/detail/sections/info/components/echo-edit-form"
import { useIsMobile } from "@/hooks/use-mobile"

type EchoEditActionProps = {
  echo: EchoRow
}

export function EchoEditAction({ echo }: EchoEditActionProps) {
  const isMobile = useIsMobile()

  return (
    <EditableSection.EditAction
      title="Editar eco"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant={isMobile ? "icon" : "default"}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <EchoEditForm echo={echo} onSaved={close} onCancel={close} />
      )}
    </EditableSection.EditAction>
  )
}
