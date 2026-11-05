import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { EchoRow } from "@/db/schema"
import {
  echoInput,
  type EchoInput,
} from "@/modules/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { updateEcho } from "@/modules/game-data/server/echoes/echoes"
import { echoDraftFromRow } from "@/modules/panel/admin/game-data/views/echoes/shared/application/echo-draft"
import { EchoFields } from "@/modules/panel/admin/game-data/views/echoes/shared/components/echo-fields"

type EchoEditFormProps = {
  echo: EchoRow
  onSaved: () => void
  onCancel: () => void
}

export function EchoEditForm({ echo, onSaved, onCancel }: EchoEditFormProps) {
  const formId = `edit-echo-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: EchoInput) => updateEcho({ data: value }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.echoes(),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.echo(updated.id),
        }),
      ])
      toast.success("Eco actualizado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: echoDraftFromRow(echo),
    validators: { onSubmit: echoInput },
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
        className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"
      >
        <EchoFields form={form} isPending={isPending} />
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
