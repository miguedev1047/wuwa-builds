import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import type { ResonatorRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ResonatorEditForm } from "@panel/admin/game-data/views/resonators/detail/sections/info/components/resonator-edit-form"
import { useIsMobile } from "@/hooks/use-mobile"
import { Show } from "@/components/utility/show"

type ResonatorEditActionProps = {
  resonator: ResonatorRow
}

export function ResonatorEditAction({ resonator }: ResonatorEditActionProps) {
  const isMobile = useIsMobile()

  return (
    <EditableSection.EditAction
      title="Editar resonador"
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
        <ResonatorEditForm
          resonator={resonator}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
