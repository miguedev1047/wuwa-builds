import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import { resonatorBestWeaponsSelectionInput } from "@catalog/application/schemas"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorBestWeaponsForm } from "@catalog/presentation/resonators/detail/sections/best-weapons/hooks/resonator-best-weapons-form"
import type { MultiComboboxOption } from "@/components/form/fields/multi-combobox-field"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorBestWeaponsEditActionProps = {
  resonatorId: number
  weaponIds: string[]
  options: MultiComboboxOption[]
}

/** Opens the full ranking editor with the current priority order selected. */
export function ResonatorBestWeaponsEditAction({
  resonatorId,
  weaponIds,
  options,
}: ResonatorBestWeaponsEditActionProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorBestWeaponsForm({
    resonatorId,
    weaponIds,
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
            <form.Subscribe selector={(state) => state.values.weaponIds}>
              {(selectedWeaponIds) => (
                <form.SubmitButton
                  label="Guardar"
                  formId={formId}
                  disabled={isPending || selectedWeaponIds.length > 10}
                />
              )}
            </form.Subscribe>
          </form.AppForm>
        </>
      }
      mode="edit"
      title="Editar mejores armas"
      description="La primera arma de la lista es la recomendación principal."
      trigger={
        <Button
          type="button"
          size={isMobile ? "icon" : "md"}
          aria-label="Editar mejores armas"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
        </Button>
      }
    >
      {() => (
        <form
          id={formId}
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit().catch(() => undefined)
          }}
        >
          <form.AppField
            name="weaponIds"
            validators={{
              onSubmit: resonatorBestWeaponsSelectionInput.shape.weaponIds,
            }}
          >
            {(field) => (
              <field.MultiComboboxField
                label="Ranking de armas"
                description="Selecciona las armas en orden; la primera será la mejor."
                options={options}
                placeholder="Seleccionar armas"
                emptyMessage="No hay armas compatibles en el catálogo"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      )}
    </EditableSection.Action>
  )
}
