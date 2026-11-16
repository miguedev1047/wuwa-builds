import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSequenceFields } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-form-fields"
import { useResonatorSequenceEditForm } from "@catalog/presentation/resonators/detail/sections/sequences/hooks/resonator-sequence-edit-form"
import type { ResonatorSequenceRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorSequenceEditActionProps = {
  sequence: ResonatorSequenceRow
}

/** Card action that opens the sequence edit form inside a dialog. */
export function ResonatorSequenceEditAction({
  sequence,
}: ResonatorSequenceEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorSequenceEditForm({
    sequence: sequence,
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
      title="Editar secuencia"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar secuencia"
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
          <ResonatorSequenceFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
