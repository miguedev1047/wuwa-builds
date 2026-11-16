import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { SonataFields } from "@catalog/presentation/sonatas/components/sonata-form-fields"
import { useSonataAddForm } from "@catalog/presentation/sonatas/hooks/sonata-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

export function SonataAddAction() {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useSonataAddForm({
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
            <form.SubmitButton label="Crear" formId={formId} />
          </form.AppForm>
        </>
      }
      mode="default"
      title="Nuevo set de sonata"
      description="Crea un set manual. Los sets de Encore llegan con la sincronizacion."
      trigger={
        <Button variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
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
          className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4"
        >
          <SonataFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
