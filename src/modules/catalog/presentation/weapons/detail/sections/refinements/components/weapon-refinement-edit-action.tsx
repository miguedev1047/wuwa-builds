import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementFields } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"
import { useWeaponRefinementEditForm } from "@catalog/presentation/weapons/detail/sections/refinements/hooks/weapon-refinement-edit-form"
import type { WeaponRefinementRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponRefinementEditActionProps = {
  refinement: WeaponRefinementRow
}

export function WeaponRefinementEditAction({
  refinement,
}: WeaponRefinementEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useWeaponRefinementEditForm({
    refinement: refinement,
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
      title="Editar refinamiento"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar refinamiento"
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
          <WeaponRefinementFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
