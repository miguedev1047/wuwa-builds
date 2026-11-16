import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { resonatorTagsSelectionInput } from "@catalog/application/schemas"
import { toTagInput } from "@catalog/presentation/resonators/detail/application/to-tag-input"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { replaceResonatorTags } from "@catalog/server/resonators/tags"
import type { ResonatorTagRow } from "@db/schema"
import type { EncoreTag } from "@encore/domain/character"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorTagsFormProps = {
  resonatorId: number
  savedTags: ResonatorTagRow[]
  encoreTags: EncoreTag[]
  onSaved: () => void
  onCancel: () => void
}

/** Tags form of the resonator, rendered inside the edit dialog. */
export function useResonatorTagsForm({
  resonatorId,
  savedTags,
  encoreTags,
  onSaved,
  onCancel,
}: ResonatorTagsFormProps) {
  const toast = useToast()

  const formId = `resonator-tags-form-${useId()}`
  const queryClient = useQueryClient()

  const options = encoreTags.map((tag) => ({
    label: tag.name,
    value: tag.name,
  }))

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (names: string[]) =>
      replaceResonatorTags({
        data: {
          resonatorId,
          tags: names.map((name) => toTagInput(name, encoreTags, savedTags)),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({ title: "Etiquetas guardadas", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { tags: savedTags.map((tag) => tag.name) },
    validators: { onSubmit: resonatorTagsSelectionInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value.tags)
    },
  })

  return { formId, options, isPending, form, onCancel }
}
