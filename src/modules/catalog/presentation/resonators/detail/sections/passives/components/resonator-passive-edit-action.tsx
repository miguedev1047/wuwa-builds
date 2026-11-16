import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorPassiveFields } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passive-form-fields"
import { useResonatorPassiveEditForm } from "@catalog/presentation/resonators/detail/sections/passives/hooks/resonator-passive-edit-form"
import type { ResonatorPassiveRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorPassiveEditActionProps = {
  passive: ResonatorPassiveRow
}

/** Card action that opens the passive edit form inside a dialog. */
export function ResonatorPassiveEditAction({
  passive,
}: ResonatorPassiveEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorPassiveEditForm({
    passive: passive,
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
      title="Editar pasiva"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar pasiva"
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
          <ResonatorPassiveFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
