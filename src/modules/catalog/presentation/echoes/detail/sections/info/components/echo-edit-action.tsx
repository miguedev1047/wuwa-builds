import { useAppForm } from "@/components/form"
import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import { echoDraftFromRow } from "@/modules/catalog/application/echoes/echo-draft"
import {
  echoInput,
  type EchoInput,
} from "@/modules/catalog/application/schemas"
import { wuwaBuildsKeys } from "@/modules/catalog/queries/keys"
import { updateEcho } from "@/modules/catalog/server/echoes/echoes"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { EchoFields } from "@catalog/presentation/echoes/shared/components/echo-fields"
import type { EchoRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"

type EchoEditActionProps = {
  echo: EchoRow
}

export function EchoEditAction({ echo }: EchoEditActionProps) {
  const toast = useToast()

  const [open, setOpen] = useState(false)

  const isMobile = useIsMobile()

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
      toast.add({ title: "Eco actualizado", type: "success" })
      setOpen(false)
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

  const onOpenChange = (next: boolean) => {
    if (isPending) return
    if (next) form.reset()
    setOpen(next)
  }

  return (
    <EditableSection.Action
      isPending={isPending}
      mode="edit"
      title="Editar eco"
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <Button type="button" variant="ghost" size={isMobile ? "icon" : "sm"}>
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
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
            <form.SubmitButton label="Guardar" formId={formId} />
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
          <EchoFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}
