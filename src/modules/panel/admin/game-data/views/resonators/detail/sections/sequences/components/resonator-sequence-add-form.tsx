import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { EncoreSequence } from "@encore/domain/character"
import type { ResonatorSequenceInput } from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { createResonatorSequences } from "@game-data/server/resonators/sequences"
import { resonatorSequencePayloads } from "@panel/admin/game-data/views/resonators/detail/application/resonator-sequence-draft"

type ResonatorSequenceAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreSequences: EncoreSequence[]
  savedSequenceIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more resonator sequences. */
export function ResonatorSequenceAddForm({
  resonatorId,
  sortOrder,
  encoreSequences,
  savedSequenceIds,
  onSaved,
  onCancel,
}: ResonatorSequenceAddFormProps) {
  const formId = `add-resonator-sequences-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: ResonatorSequenceInput[]) =>
      createResonatorSequences({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success(
        payloads.length === 1
          ? "Secuencia agregada"
          : `${payloads.length} secuencias agregadas`
      )
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { sequenceIds: [] as string[] },
    validators: {
      onSubmit: ({ value }) =>
        value.sequenceIds.length === 0
          ? "Selecciona al menos una secuencia"
          : undefined,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        resonatorSequencePayloads(
          value.sequenceIds,
          encoreSequences,
          resonatorId,
          sortOrder
        )
      )
    },
  })

  const options = encoreSequences
    .filter((sequence) => !savedSequenceIds.includes(sequence.id))
    .map((sequence) => ({
      label: `Secuencia ${sequence.index}`,
      value: String(sequence.id),
    }))

  return (
    <>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
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

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
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
      </DialogFooter>
    </>
  )
}
