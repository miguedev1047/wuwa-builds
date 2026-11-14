import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { SonataSetEffectRow, SonataSetRow } from "@db/schema"
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
import { SonataFields } from "@catalog/presentation/sonatas/components/sonata-form-fields"

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

type SonataEditFormProps = {
  sonata: SonataWithEffects
  onSaved: () => void
  onCancel: () => void
}

export function SonataEditForm({
  sonata,
  onSaved,
  onCancel,
}: SonataEditFormProps) {
  const formId = `edit-sonata-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: SonataFormInput) =>
      updateSonata({ data: toSonataInput(value) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.success("Set de sonata actualizado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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

  return (
    <>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4"
      >
        <SonataFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>
        <form.AppForm>
          <form.SubmitButton label="Guardar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
