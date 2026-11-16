import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { SonataFields } from "@catalog/presentation/sonatas/components/sonata-form-fields"
import { useSonataEditForm } from "@catalog/presentation/sonatas/hooks/sonata-edit-form"
import type { SonataSetEffectRow, SonataSetRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

type SonataEditActionProps = {
  sonata: SonataWithEffects
}

export function SonataEditAction({ sonata }: SonataEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useSonataEditForm({
    sonata: sonata,
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
      title="Editar set de sonata"
      trigger={
        <Button type="button" variant="ghost" size="icon">
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
          className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4"
        >
          <SonataFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
