import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { toSonataInput } from "@catalog/application/echoes/sonatas"
import {
  sonataFormInput,
  type SonataFormInput,
} from "@catalog/application/schemas"
import { sonataFormDefaults } from "@catalog/presentation/sonatas/components/sonata-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createSonata } from "@catalog/server/echoes/sonatas"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type SonataAddFormProps = {
  onSaved: () => void
  onCancel: () => void
}

export function useSonataAddForm({ onSaved, onCancel }: SonataAddFormProps) {
  const toast = useToast()

  const formId = `new-sonata-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: SonataFormInput) =>
      createSonata({ data: toSonataInput(value) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.add({ title: "Set de sonata creado", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: sonataFormDefaults,
    validators: { onSubmit: sonataFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
