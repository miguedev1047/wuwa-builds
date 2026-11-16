import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import type { ResonatorSequenceInput } from "@catalog/application/schemas"
import { resonatorSequencePayloads } from "@catalog/presentation/resonators/detail/application/resonator-sequence-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorSequences } from "@catalog/server/resonators/sequences"
import type { EncoreSequence } from "@encore/domain/character"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorSequenceAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreSequences: EncoreSequence[]
  savedSequenceIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more resonator sequences. */
export function useResonatorSequenceAddForm({
  resonatorId,
  sortOrder,
  encoreSequences,
  savedSequenceIds,
  onSaved,
  onCancel,
}: ResonatorSequenceAddFormProps) {
  const toast = useToast()

  const formId = `add-resonator-sequences-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: ResonatorSequenceInput[]) =>
      createResonatorSequences({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Secuencia agregada"
            : `${payloads.length} secuencias agregadas`,
        type: "success",
      })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

  return { formId, isPending, form, options, onCancel }
}
