import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  sonataDraftFromRow,
  toSonataInput,
} from "@catalog/application/echoes/sonatas"
import {
  sonataFormInput,
  type SonataFormInput,
} from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateSonata } from "@catalog/server/echoes/sonatas"
import type { SonataSetEffectRow, SonataSetRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

type SonataEditFormProps = {
  sonata: SonataWithEffects
  onSaved: () => void
  onCancel: () => void
}

export function useSonataEditForm({
  sonata,
  onSaved,
  onCancel,
}: SonataEditFormProps) {
  const toast = useToast()

  const formId = `edit-sonata-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: SonataFormInput) =>
      updateSonata({ data: toSonataInput(value) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.add({ title: "Set de sonata actualizado", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: sonataDraftFromRow(sonata),
    validators: { onSubmit: sonataFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
