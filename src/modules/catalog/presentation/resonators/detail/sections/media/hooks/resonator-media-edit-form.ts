import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  resonatorMediaUpdateInput,
  type ResonatorMediaUpdateInput,
} from "@catalog/application/schemas"
import { resonatorMediaDraftFromRow } from "@catalog/presentation/resonators/detail/application/resonator-media-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateResonatorMedia } from "@catalog/server/resonators/media"
import type { ResonatorMediaRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorMediaEditFormProps = {
  media: ResonatorMediaRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of one resonator image, rendered inside the edit dialog. */
export function useResonatorMediaEditForm({
  media,
  onSaved,
  onCancel,
}: ResonatorMediaEditFormProps) {
  const toast = useToast()

  const formId = `edit-resonator-media-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorMediaUpdateInput) =>
      updateResonatorMedia({ data: value }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.character(media.resonatorId),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.characters(),
        }),
      ])
      toast.add({ title: "Imagen actualizada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorMediaDraftFromRow(media),
    validators: { onSubmit: resonatorMediaUpdateInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
