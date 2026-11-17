import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import type { MultiComboboxOption } from "@/components/form/fields/multi-combobox-field"
import { resonatorBestSetsSelectionInput } from "@catalog/application/schemas"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorBestSetsForm } from "@catalog/presentation/resonators/detail/sections/best-sets/hooks/resonator-best-sets-form"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorBestSetsEditActionProps = {
  resonatorId: number
  setIds: string[]
  options: MultiComboboxOption[]
}

/** Opens the full Sonata set ranking editor. */
export function ResonatorBestSetsEditAction({
  resonatorId,
  setIds,
  options,
}: ResonatorBestSetsEditActionProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorBestSetsForm({
    resonatorId,
    setIds,
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
            <form.Subscribe selector={(state) => state.values.setIds}>
              {(selectedSetIds) => (
                <form.SubmitButton
                  label="Guardar"
                  formId={formId}
                  disabled={isPending || selectedSetIds.length > 10}
                />
              )}
            </form.Subscribe>
          </form.AppForm>
        </>
      }
      mode="edit"
      title="Editar mejores sets"
      description="El primer set de la lista tiene la mayor prioridad."
      trigger={
        <Button
          type="button"
          size={isMobile ? "icon" : "md"}
          aria-label="Editar mejores sets"
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
            name="setIds"
            validators={{
              onSubmit: resonatorBestSetsSelectionInput.shape.setIds,
            }}
          >
            {(field) => (
              <field.MultiComboboxField
                label="Ranking de sets"
                description="Selecciona los sets en orden; el primero tendrá prioridad."
                options={options}
                placeholder="Seleccionar sets de Sonata"
                emptyMessage="No hay sets disponibles en el catálogo"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      )}
    </EditableSection.Action>
  )
}
