import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorMediaRow } from "@db/schema"
import { resonatorMediaLabel } from "@catalog/application/constants/resonator"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorMediaEditForm } from "@catalog/presentation/resonators/detail/sections/media/components/resonator-media-edit-form"

type ResonatorMediaEditActionProps = {
  media: ResonatorMediaRow
}

/** Item action that opens the image edit form inside a dialog. */
export function ResonatorMediaEditAction({
  media,
}: ResonatorMediaEditActionProps) {
  const label = resonatorMediaLabel(media.kind)

  return (
    <EditableSection.EditAction
      title={`Editar ${label}`}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label={`Editar ${label}`}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorMediaEditForm
          media={media}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
