import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { resonatorDraftFromRow } from "@catalog/application/resonators/resonator-draft"
import {
  resonatorInput,
  type ResonatorInput,
} from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateResonator } from "@catalog/server/resonators/resonators"
import type { ResonatorRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorEditFormProps = {
  resonator: ResonatorRow
  onSaved: () => void
  onCancel: () => void
}

export function useResonatorEditForm({
  resonator,
  onSaved,
  onCancel,
}: ResonatorEditFormProps) {
  const toast = useToast()

  const formId = `edit-resonator-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorInput) => updateResonator({ data: value }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.characters(),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.character(updated.id),
        }),
      ])
      toast.add({ title: "Resonador actualizado", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorDraftFromRow(resonator),
    validators: { onSubmit: resonatorInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
