import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  resonatorSkillUpdateInput,
  type ResonatorSkillUpdateInput,
} from "@catalog/application/schemas"
import { resonatorSkillDraftFromRow } from "@catalog/presentation/resonators/detail/application/resonator-skill-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateResonatorSkill } from "@catalog/server/resonators/skills"
import type { ResonatorSkillRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorSkillEditFormProps = {
  skill: ResonatorSkillRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a resonator skill, rendered inside the edit dialog. */
export function useResonatorSkillEditForm({
  skill,
  onSaved,
  onCancel,
}: ResonatorSkillEditFormProps) {
  const toast = useToast()

  const formId = `edit-resonator-skill-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorSkillUpdateInput) =>
      updateResonatorSkill({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(skill.resonatorId),
      })
      toast.add({ title: "Habilidad actualizada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

  return { formId, isPending, form, onCancel }
}
