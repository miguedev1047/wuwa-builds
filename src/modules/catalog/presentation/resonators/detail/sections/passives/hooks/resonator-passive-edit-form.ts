import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  resonatorPassiveUpdateInput,
  type ResonatorPassiveUpdateInput,
} from "@catalog/application/schemas"
import { resonatorPassiveDraftFromRow } from "@catalog/presentation/resonators/detail/application/resonator-passive-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateResonatorPassive } from "@catalog/server/resonators/passives"
import type { ResonatorPassiveRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorPassiveEditFormProps = {
  passive: ResonatorPassiveRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a resonator passive, rendered inside the edit dialog. */
export function useResonatorPassiveEditForm({
  passive,
  onSaved,
  onCancel,
}: ResonatorPassiveEditFormProps) {
  const toast = useToast()

  const formId = `edit-resonator-passive-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorPassiveUpdateInput) =>
      updateResonatorPassive({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(passive.resonatorId),
      })
      toast.add({ title: "Pasiva actualizada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorPassiveDraftFromRow(passive),
    validators: { onSubmit: resonatorPassiveUpdateInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
