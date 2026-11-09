import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ResonatorMediaRow } from "@/db/schema"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  resonatorMediaUpdateInput,
  type ResonatorMediaUpdateInput,
} from "@/modules/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { updateResonatorMedia } from "@/modules/game-data/server/resonators/media"
import { resonatorMediaDraftFromRow } from "@/modules/panel/admin/game-data/views/resonators/detail/application/resonator-media-draft"
import { ResonatorMediaFields } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/media/components/resonator-media-form-fields"

type ResonatorMediaEditFormProps = {
  media: ResonatorMediaRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of one resonator image, rendered inside the edit dialog. */
export function ResonatorMediaEditForm({
  media,
  onSaved,
  onCancel,
}: ResonatorMediaEditFormProps) {
  const formId = `edit-resonator-media-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorMediaUpdateInput) =>
      updateResonatorMedia({ data: value }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.character(media.resonatorId),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.characters(),
        }),
      ])
      toast.success("Imagen actualizada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorMediaDraftFromRow(media),
    validators: { onSubmit: resonatorMediaUpdateInput },
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
      >
        <ResonatorMediaFields form={form} isPending={isPending} />
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
