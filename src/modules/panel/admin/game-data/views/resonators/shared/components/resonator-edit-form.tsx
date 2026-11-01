import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import type { ResonatorRow } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  resonatorInput,
  type ResonatorInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { updateResonator } from "@/modules/panel/admin/game-data/server/characters"
import { resonatorDraftFromRow } from "@/modules/panel/admin/game-data/views/resonators/shared/application/resonator-draft"
import { ResonatorFields } from "@/modules/panel/admin/game-data/views/resonators/shared/components/resonator-fields"

type ResonatorEditFormProps = {
  resonator: ResonatorRow
  onSaved: () => void
  onCancel: () => void
}

export function ResonatorEditForm({
  resonator,
  onSaved,
  onCancel,
}: ResonatorEditFormProps) {
  const formId = `edit-resonator-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorInput) => updateResonator({ data: value }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.characters(),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.character(updated.id),
        }),
      ])
      toast.success("Resonador actualizado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorDraftFromRow(resonator),
    validators: { onSubmit: resonatorInput },
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
        <ResonatorFields form={form} isPending={isPending} />
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
