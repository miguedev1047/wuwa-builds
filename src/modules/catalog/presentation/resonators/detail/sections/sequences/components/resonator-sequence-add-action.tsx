import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorSequenceAddForm } from "@catalog/presentation/resonators/detail/sections/sequences/hooks/resonator-sequence-add-form"
import type { EncoreSequence } from "@encore/domain/character"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorSequenceAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxSequences: boolean
  encoreSequences: EncoreSequence[]
  savedSequenceIds: number[]
}

/** Header action that opens the sequence form inside a dialog. */
export function ResonatorSequenceAddAction({
  resonatorId,
  sortOrder,
  isMaxSequences,
  encoreSequences,
  savedSequenceIds,
}: ResonatorSequenceAddActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, options, onCancel } =
    useResonatorSequenceAddForm({
      resonatorId: resonatorId,
      sortOrder: sortOrder,
      encoreSequences: encoreSequences,
      savedSequenceIds: savedSequenceIds,
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
            <form.Subscribe selector={(state) => state.values.sequenceIds}>
              {(sequenceIds) => (
                <form.SubmitButton
                  label="Agregar"
                  formId={formId}
                  disabled={sequenceIds.length === 0}
                />
              )}
            </form.Subscribe>
          </form.AppForm>
        </>
      }
      mode="default"
      disabled={isMaxSequences}
      title="Agregar secuencias"
      description="Elige una o mas secuencias de Encore."
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
          <form.AppField name="sequenceIds">
            {(field) => (
              <field.MultiComboboxField
                label="Autocompletado inteligente"
                description="Copia las secuencias del resonador en Encore."
                options={options}
                placeholder="Agregar secuencia"
                emptyMessage="Sin secuencias disponibles"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      )}
    </EditableSection.Action>
  )
}
