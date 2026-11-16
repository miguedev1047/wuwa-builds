import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementStatFields } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stat-form-fields"
import { useWeaponRefinementStatAddForm } from "@catalog/presentation/weapons/detail/sections/refinements/hooks/weapon-refinement-stat-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponRefinementStatAddActionProps = {
  refinementId: number
  weaponId: number
  sortOrder: number
}

/** Card footer action that opens the stat dialog. */
export function WeaponRefinementStatAddAction({
  refinementId,
  weaponId,
  sortOrder,
}: WeaponRefinementStatAddActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useWeaponRefinementStatAddForm({
    refinementId: refinementId,
    weaponId: weaponId,
    sortOrder: sortOrder,
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
      title="Agregar estadística"
      description="Selecciona una o más estadísticas y su valor."
      label="Agregar estadística"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Agregar estadística"
        >
          <HugeiconsIcon icon={PlusIcon} />
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
          <WeaponRefinementStatFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
