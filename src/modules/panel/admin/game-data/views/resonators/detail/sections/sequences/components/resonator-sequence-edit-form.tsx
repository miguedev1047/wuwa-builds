import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import type { ResonatorSequenceRow } from "@db/schema"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  resonatorSequenceUpdateInput,
  type ResonatorSequenceUpdateInput,
} from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { updateResonatorSequence } from "@game-data/server/resonators/sequences"
import { resonatorSequenceDraftFromRow } from "@panel/admin/game-data/views/resonators/detail/application/resonator-sequence-draft"
import { ResonatorSequenceFields } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-form-fields"

type ResonatorSequenceEditFormProps = {
  sequence: ResonatorSequenceRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a resonator sequence, rendered inside the edit dialog. */
export function ResonatorSequenceEditForm({
  sequence,
  onSaved,
  onCancel,
}: ResonatorSequenceEditFormProps) {
  const formId = `edit-resonator-sequence-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorSequenceUpdateInput) =>
      updateResonatorSequence({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(sequence.resonatorId),
      })
      toast.success("Secuencia actualizada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorSequenceDraftFromRow(sequence),
    validators: { onSubmit: resonatorSequenceUpdateInput },
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
        <ResonatorSequenceFields form={form} isPending={isPending} />
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
