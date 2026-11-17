import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { resonatorBestSetsSelectionInput } from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { replaceResonatorBestSets } from "@catalog/server/resonators/best-sets"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorBestSetsFormProps = {
  resonatorId: number
  setIds: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Full replacement form for the resonator Sonata set ranking. */
export function useResonatorBestSetsForm({
  resonatorId,
  setIds,
  onSaved,
  onCancel,
}: ResonatorBestSetsFormProps) {
  const toast = useToast()
  const formId = `resonator-best-sets-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (selectedSetIds: string[]) =>
      replaceResonatorBestSets({
        data: {
          resonatorId,
          sets: selectedSetIds.map((setId) => ({ setId: Number(setId) })),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({ title: "Sets recomendados guardados", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { setIds },
    validators: { onSubmit: resonatorBestSetsSelectionInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value.setIds)
    },
  })

  return { formId, isPending, form, onCancel }
}
