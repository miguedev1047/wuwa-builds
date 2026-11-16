import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorEditForm } from "@catalog/presentation/resonators/detail/sections/info/hooks/resonator-edit-form"
import { ResonatorFields } from "@catalog/presentation/resonators/shared/components/resonator-fields"
import type { ResonatorRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorEditActionProps = {
  resonator: ResonatorRow
}

export function ResonatorEditAction({ resonator }: ResonatorEditActionProps) {
  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorEditForm({
    resonator: resonator,
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
      title="Editar resonador"
      trigger={
        <Button type="button" variant="ghost" size={isMobile ? "icon" : "md"}>
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
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
          <ResonatorFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
