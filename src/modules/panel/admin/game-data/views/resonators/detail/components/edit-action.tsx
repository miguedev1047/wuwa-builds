import { Button } from "@/components/ui/button"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import type { ResonatorRow } from "@/db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ResonatorEditForm } from "@/modules/panel/admin/game-data/views/resonators/detail/components/edit-form"
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
        <Button
          type="button"
          variant="secondary"
          size={isMobile ? "icon-sm" : "sm"}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
        </Button>
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
