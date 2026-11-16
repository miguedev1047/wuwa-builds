import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorPassiveAddForm } from "@catalog/presentation/resonators/detail/sections/passives/hooks/resonator-passive-add-form"
import type { EncorePassive } from "@encore/domain/character"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorPassiveAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxPassives: boolean
  encorePassives: EncorePassive[]
  savedPassiveIds: number[]
}

/** Header action that opens the passive form inside a dialog. */
export function ResonatorPassiveAddAction({
  resonatorId,
  sortOrder,
  isMaxPassives,
  encorePassives,
  savedPassiveIds,
}: ResonatorPassiveAddActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, options, onCancel } =
    useResonatorPassiveAddForm({
      resonatorId: resonatorId,
      sortOrder: sortOrder,
      encorePassives: encorePassives,
      savedPassiveIds: savedPassiveIds,
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
            <form.Subscribe selector={(state) => state.values.passiveIds}>
              {(passiveIds) => (
                <form.SubmitButton
                  label="Agregar"
                  formId={formId}
                  disabled={passiveIds.length === 0}
                />
              )}
            </form.Subscribe>
          </form.AppForm>
        </>
      }
      mode="default"
      disabled={isMaxPassives}
      title="Agregar pasivas"
      description="Elige una o mas pasivas de Encore."
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
          className="space-y-4"
        >
          <form.AppField name="passiveIds">
            {(field) => (
              <field.MultiComboboxField
                label="Autocompletado inteligente"
                description="Copia las pasivas del resonador en Encore."
                options={options}
                placeholder="Agregar pasiva"
                emptyMessage="Sin pasivas disponibles"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      )}
    </EditableSection.Action>
  )
}
