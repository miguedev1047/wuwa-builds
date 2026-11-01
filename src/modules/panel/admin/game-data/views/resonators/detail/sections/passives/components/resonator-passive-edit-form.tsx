import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import type { ResonatorPassiveRow } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  resonatorPassiveUpdateInput,
  type ResonatorPassiveUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { updateResonatorPassive } from "@/modules/panel/admin/game-data/server/passives"
import { resonatorPassiveDraftFromRow } from "@/modules/panel/admin/game-data/views/resonators/detail/application/resonator-passive-draft"
import { ResonatorPassiveFields } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-form-fields"

type ResonatorPassiveEditFormProps = {
  passive: ResonatorPassiveRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a resonator passive, rendered inside the edit dialog. */
export function ResonatorPassiveEditForm({
  passive,
  onSaved,
  onCancel,
}: ResonatorPassiveEditFormProps) {
  const formId = `edit-resonator-passive-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorPassiveUpdateInput) =>
      updateResonatorPassive({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(passive.resonatorId),
      })
      toast.success("Pasiva actualizada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorPassiveDraftFromRow(passive),
    validators: { onSubmit: resonatorPassiveUpdateInput },
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
        <ResonatorPassiveFields form={form} isPending={isPending} />
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
