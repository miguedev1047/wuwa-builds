import { useAppForm, type FormOption } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { FieldGroup } from "@/components/ui/field"

import {
  echoSetFormInput,
  type EchoSetFormInput,
  type EchoSetInput,
} from "@/modules/catalog/application/schemas"
import { createEchoSet } from "@/modules/catalog/server/echoes/sets"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"

import { Button } from "@/components/panelui/button"
import { wuwaBuildsKeys } from "@/modules/catalog/queries/keys"

type EchoSetAddActionProps = {
  echoId: number
  /** Sets Encore assigns to the echo that are not saved yet. */
  options: FormOption[]
}

export function EchoSetAddAction({ echoId, options }: EchoSetAddActionProps) {
  const toast = useToast()

  const [open, setOpen] = useState(false)

  const formId = `add-echo-set-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: EchoSetInput) => createEchoSet({ data: value }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.echo(echoId),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.echoesSelection(),
        }),
      ])
      toast.add({ title: "Set agregado al eco", type: "success" })
      setOpen(false)
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

  const onOpenChange = (next: boolean) => {
    if (isPending) return
    if (next) form.reset()
    setOpen(next)
  }

  return (
    <EditableSection.Action
      isPending={isPending}
      mode="default"
      title="Agregar set"
      open={open}
      onOpenChange={onOpenChange}
      description="Sets que Encore detecta para este eco."
      disabled={options.length === 0}
      trigger={
        <Button variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </Button>
      }
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cerrar
          </Button>
          <form.AppForm>
            <form.SubmitButton label="Agregar" formId={formId} />
          </form.AppForm>
        </>
      }
    >
      {() => (
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit().catch(() => undefined)
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
      )}
    </EditableSection.Action>
  )
}
