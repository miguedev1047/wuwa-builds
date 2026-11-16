import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  resonatorSequenceUpdateInput,
  type ResonatorSequenceUpdateInput,
} from "@catalog/application/schemas"
import { resonatorSequenceDraftFromRow } from "@catalog/presentation/resonators/detail/application/resonator-sequence-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateResonatorSequence } from "@catalog/server/resonators/sequences"
import type { ResonatorSequenceRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorSequenceEditFormProps = {
  sequence: ResonatorSequenceRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a resonator sequence, rendered inside the edit dialog. */
export function useResonatorSequenceEditForm({
  sequence,
  onSaved,
  onCancel,
}: ResonatorSequenceEditFormProps) {
  const toast = useToast()

  const formId = `edit-resonator-sequence-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorSequenceUpdateInput) =>
      updateResonatorSequence({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(sequence.resonatorId),
      })
      toast.add({ title: "Secuencia actualizada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorSequenceDraftFromRow(sequence),
    validators: { onSubmit: resonatorSequenceUpdateInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
