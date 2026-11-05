import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import type { FormOption } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import {
  echoSetFormInput,
  type EchoSetFormInput,
  type EchoSetInput,
} from "@/modules/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { createEchoSet } from "@/modules/game-data/server/echoes/sets"

type EchoSetAddFormProps = {
  echoId: number
  options: FormOption[]
  onSaved: () => void
  onCancel: () => void
}

export function EchoSetAddForm({
  echoId,
  options,
  onSaved,
  onCancel,
}: EchoSetAddFormProps) {
  const formId = `add-echo-set-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: EchoSetInput) => createEchoSet({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.success("Set agregado al eco")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { echoId, setId: null } as EchoSetFormInput,
    validators: { onSubmit: echoSetFormInput },
    onSubmit: async ({ value }) => {
      if (value.setId === null) return

      await mutateAsync({ echoId: value.echoId, setId: value.setId })
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
      >
        <FieldGroup>
          <form.AppField name="setId">
            {(field) => (
              <field.SelectField
                label="Set de sonata"
                options={options}
                placeholder="Seleccionar set"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>
        <form.AppForm>
          <form.SubmitButton label="Agregar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
