import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import type { ResonatorSkillRow } from "@db/schema"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  resonatorSkillUpdateInput,
  type ResonatorSkillUpdateInput,
} from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { updateResonatorSkill } from "@game-data/server/resonators/skills"
import { resonatorSkillDraftFromRow } from "@panel/admin/game-data/views/resonators/detail/application/resonator-skill-draft"
import { ResonatorSkillFields } from "@panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-form-fields"

type ResonatorSkillEditFormProps = {
  skill: ResonatorSkillRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a resonator skill, rendered inside the edit dialog. */
export function ResonatorSkillEditForm({
  skill,
  onSaved,
  onCancel,
}: ResonatorSkillEditFormProps) {
  const formId = `edit-resonator-skill-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorSkillUpdateInput) =>
      updateResonatorSkill({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(skill.resonatorId),
      })
      toast.success("Habilidad actualizada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: resonatorSkillDraftFromRow(skill),
    validators: { onSubmit: resonatorSkillUpdateInput },
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
        <ResonatorSkillFields form={form} isPending={isPending} />
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
