import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { toSonataInput } from "@/modules/game-data/application/echoes/sonatas"
import {
  sonataFormInput,
  type SonataFormInput,
} from "@/modules/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { createSonata } from "@/modules/game-data/server/echoes/sonatas"
import {
  SonataFields,
  sonataFormDefaults,
} from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-form-fields"

type SonataAddFormProps = {
  onSaved: () => void
  onCancel: () => void
}

export function SonataAddForm({ onSaved, onCancel }: SonataAddFormProps) {
  const formId = `new-sonata-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: SonataFormInput) =>
      createSonata({ data: toSonataInput(value) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.success("Set de sonata creado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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
          <form.SubmitButton label="Crear" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
