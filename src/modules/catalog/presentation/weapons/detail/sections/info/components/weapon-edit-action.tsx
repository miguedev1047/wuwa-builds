import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useWeaponEditForm } from "@catalog/presentation/weapons/detail/sections/info/hooks/weapon-edit-form"
import { WeaponFields } from "@catalog/presentation/weapons/shared/components/weapon-fields"
import type { WeaponRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponEditActionProps = {
  weapon: WeaponRow
}

export function WeaponEditAction({ weapon }: WeaponEditActionProps) {
  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useWeaponEditForm({
    weapon: weapon,
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
      title="Editar arma"
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
          <WeaponFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
