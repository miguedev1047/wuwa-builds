import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementStatFields } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stat-form-fields"
import { useWeaponRefinementStatEditForm } from "@catalog/presentation/weapons/detail/sections/refinements/hooks/weapon-refinement-stat-edit-form"
import type { WeaponRefinementStatRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponRefinementStatEditActionProps = {
  stat: WeaponRefinementStatRow
  weaponId: number
}

export function WeaponRefinementStatEditAction({
  stat,
  weaponId,
}: WeaponRefinementStatEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useWeaponRefinementStatEditForm(
    {
      stat: stat,
      weaponId: weaponId,
      onSaved: () => setOpen(false),
      onCancel: () => setOpen(false),
    }
  )
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
      title="Editar estadística"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar estadística"
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
          className="space-y-4"
        >
          <WeaponRefinementStatFields
            form={form}
            isPending={isPending}
            allowAdd={false}
          />
        </form>
      )}
    </EditableSection.Action>
  )
}
