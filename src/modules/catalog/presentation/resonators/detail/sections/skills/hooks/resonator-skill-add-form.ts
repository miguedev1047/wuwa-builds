import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import type { ResonatorSkillInput } from "@catalog/application/schemas"
import { resonatorSkillPayloads } from "@catalog/presentation/resonators/detail/application/resonator-skill-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorSkills } from "@catalog/server/resonators/skills"
import type { EncoreSkill } from "@encore/domain/character"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorSkillAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreSkills: EncoreSkill[]
  savedSkillIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more resonator skills. */
export function useResonatorSkillAddForm({
  resonatorId,
  sortOrder,
  encoreSkills,
  savedSkillIds,
  onSaved,
  onCancel,
}: ResonatorSkillAddFormProps) {
  const toast = useToast()

  const formId = `add-resonator-skills-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payloads: ResonatorSkillInput[]) =>
      await createResonatorSkills({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Habilidad agregada"
            : `${payloads.length} habilidades agregadas`,
        type: "success",
      })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { skillIds: [] as string[] },
    validators: {
      onSubmit: ({ value }) =>
        value.skillIds.length === 0
          ? "Selecciona al menos una habilidad"
          : undefined,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        resonatorSkillPayloads(
          value.skillIds,
          encoreSkills,
          resonatorId,
          sortOrder
        )
      )
    },
  })

  const options = encoreSkills
    .filter((skill) => !savedSkillIds.includes(skill.id))
    .map((skill) => ({
      label: `${skill.type}`,
      value: String(skill.id),
    }))
    .slice(0, 9)

  return { formId, isPending, form, options, onCancel }
}
