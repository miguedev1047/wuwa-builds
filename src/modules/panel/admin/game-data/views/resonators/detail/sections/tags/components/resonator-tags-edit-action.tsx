import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorTagRow } from "@/db/schema"
import { Show } from "@/components/utility/show"
import type { EncoreTag } from "@/modules/encore/domain/character"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorTagsForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/tags/components/resonator-tags-form"
import { useIsMobile } from "@/hooks/use-mobile"

type ResonatorTagsEditActionProps = {
  resonatorId: number
  savedTags: ResonatorTagRow[]
  encoreTags: EncoreTag[]
}

/** Header action that opens the tags form inside a dialog. */
export function ResonatorTagsEditAction({
  resonatorId,
  savedTags,
  encoreTags,
}: ResonatorTagsEditActionProps) {
  const isMobile = useIsMobile()

  return (
    <EditableSection.EditAction
      title="Editar etiquetas"
      description="Selecciona los estilos de combate del resonador."
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant={isMobile ? "icon" : "default"}
          aria-label="Editar etiquetas"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorTagsForm
          resonatorId={resonatorId}
          savedTags={savedTags}
          encoreTags={encoreTags}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
