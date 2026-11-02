import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ResonatorTagRow } from "@/db/schema"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { EncoreTag } from "@/modules/encore/domain/character"
import { resonatorTagsSelectionInput } from "@/modules/panel/admin/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { replaceResonatorTags } from "@/modules/panel/admin/game-data/server/resonators/tags"
import { toTagInput } from "@/modules/panel/admin/game-data/views/resonators/detail/application/to-tag-input"

type ResonatorTagsFormProps = {
  resonatorId: number
  savedTags: ResonatorTagRow[]
  encoreTags: EncoreTag[]
  onSaved: () => void
  onCancel: () => void
}

/** Tags form of the resonator, rendered inside the edit dialog. */
export function ResonatorTagsForm({
  resonatorId,
  savedTags,
  encoreTags,
  onSaved,
  onCancel,
}: ResonatorTagsFormProps) {
  const formId = `resonator-tags-form-${useId()}`
  const queryClient = useQueryClient()

  const options = encoreTags.map((tag) => ({
    label: tag.name,
    value: tag.name,
  }))

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (names: string[]) =>
      replaceResonatorTags({
        data: {
          resonatorId,
          tags: names.map((name) => toTagInput(name, encoreTags, savedTags)),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Etiquetas guardadas")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { tags: savedTags.map((tag) => tag.name) },
    validators: { onSubmit: resonatorTagsSelectionInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value.tags)
    },
  })

  return (
    <>
      <form
        id={formId}
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.AppField
          name="tags"
          validators={{ onSubmit: resonatorTagsSelectionInput.shape.tags }}
        >
          {(field) => (
            <field.MultiComboboxField
              label="Etiquetas de rol"
              options={options}
              placeholder="Agregar etiqueta"
              disabled={isPending}
            />
          )}
        </form.AppField>
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
