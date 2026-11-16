import { Button } from "@/components/panelui/button"
import { resonatorMediaLabel } from "@catalog/application/constants/resonator"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorMediaFields } from "@catalog/presentation/resonators/detail/sections/media/components/resonator-media-form-fields"
import { useResonatorMediaEditForm } from "@catalog/presentation/resonators/detail/sections/media/hooks/resonator-media-edit-form"
import type { ResonatorMediaRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorMediaEditActionProps = {
  media: ResonatorMediaRow
}

/** Item action that opens the image edit form inside a dialog. */
export function ResonatorMediaEditAction({
  media,
}: ResonatorMediaEditActionProps) {
  const label = resonatorMediaLabel(media.kind)

  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorMediaEditForm({
    media: media,
    onSaved: () => setOpen(false),
    onCancel: () => setOpen(false),
  })
  const onOpenChange = (next: boolean) => {
    if (isPending) return
    if (next) form.reset()
    setOpen(next)
  }
  return (
    <EditableSection.Action
      open={open}
      onOpenChange={onOpenChange}
      isPending={isPending}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cerrar
          </Button>

          <form.AppForm>
            <form.SubmitButton label="Guardar" formId={formId} />
          </form.AppForm>
        </>
      }
      mode="edit"
      title={`Editar ${label}`}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Editar ${label}`}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </Button>
      }
    >
      {() => (
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit().catch(() => undefined)
          }}
        >
          <ResonatorMediaFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
