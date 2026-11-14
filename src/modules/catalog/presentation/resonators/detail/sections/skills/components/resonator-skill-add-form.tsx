import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { EncoreSkill } from "@encore/domain/character"
import type { ResonatorSkillInput } from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorSkills } from "@catalog/server/resonators/skills"
import { resonatorSkillPayloads } from "@catalog/presentation/resonators/detail/application/resonator-skill-draft"

type ResonatorSkillAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreSkills: EncoreSkill[]
  savedSkillIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more resonator skills. */
export function ResonatorSkillAddForm({
  resonatorId,
  sortOrder,
  encoreSkills,
  savedSkillIds,
  onSaved,
  onCancel,
}: ResonatorSkillAddFormProps) {
  const formId = `add-resonator-skills-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payloads: ResonatorSkillInput[]) =>
      await createResonatorSkills({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success(
        payloads.length === 1
          ? "Habilidad agregada"
          : `${payloads.length} habilidades agregadas`
      )
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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

  return (
    <>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.AppField name="skillIds">
          {(field) => (
            <field.MultiComboboxField
              label="Autocompletado inteligente"
              description="Copia las habilidades del resonador en Encore."
              options={options}
              placeholder="Agregar habilidad"
              emptyMessage="Sin habilidades disponibles"
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
          <form.Subscribe selector={(state) => state.values.skillIds}>
            {(skillIds) => (
              <form.SubmitButton
                label="Agregar"
                formId={formId}
                disabled={skillIds.length === 0}
              />
            )}
          </form.Subscribe>
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
