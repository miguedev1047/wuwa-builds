import { useId, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Show } from "@/components/utility/show"
import type { EncoreSkill } from "@/modules/encore/domain/character"
import {
  resonatorSkillFormInput,
  type ResonatorSkillInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createResonatorSkill } from "@/modules/panel/admin/game-data/server/skills"
import { resonatorSkillDraftFromEncore } from "@/modules/panel/admin/game-data/views/resonators/detail/application/resonator-skill-draft"
import {
  ResonatorSkillFields,
  resonatorSkillFormDefaults,
} from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-form-fields"

type ResonatorSkillAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreSkills: EncoreSkill[]
  savedSkillIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a resonator skill, rendered inside the add dialog. */
export function ResonatorSkillAddForm({
  resonatorId,
  sortOrder,
  encoreSkills,
  savedSkillIds,
  onSaved,
  onCancel,
}: ResonatorSkillAddFormProps) {
  const id = useId()
  const formId = `add-resonator-skill-form-${id}`
  const encoreFieldId = `add-resonator-skill-encore-${id}`

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorSkillInput) =>
      createResonatorSkill({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Habilidad agregada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...resonatorSkillFormDefaults, resonatorId, sortOrder },
    validators: { onSubmit: resonatorSkillFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        resonatorId: value.resonatorId,
        skillId: value.skillId,
        sortOrder: value.sortOrder,
        type: value.type,
        name: value.name,
        description: value.description,
        icon: value.icon,
        media: value.media,
      })
    },
  })

  const options = encoreSkills
    .filter((skill) => !savedSkillIds.includes(skill.id))
    .map((skill) => ({
      label: `${skill.type} - ${skill.name}`,
      value: String(skill.id),
      skill,
    }))

  return (
    <>
      <Show when={options.length > 0}>
        <Field>
          <FieldLabel htmlFor={encoreFieldId}>
            Autocompletado inteligente
          </FieldLabel>

          <Select
            items={options}
            value={selectedSkill}
            disabled={isPending}
            onValueChange={(value) => {
              if (value === null) return

              const option = options.find((item) => item.value === value)

              if (!option) return

              form.reset(
                resonatorSkillDraftFromEncore(
                  option.skill,
                  resonatorId,
                  sortOrder
                )
              )
              setSelectedSkill(null)
            }}
          >
            <SelectTrigger id={encoreFieldId} className="w-full">
              <SelectValue placeholder="Elegir habilidad de Encore" />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldDescription>
            Copia los datos de la habilidad del resonador
          </FieldDescription>
        </Field>
      </Show>

      <Separator />

      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[50vh] space-y-4 overflow-y-auto px-4"
      >
        <ResonatorSkillFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.Subscribe selector={(state) => state.values.skillId}>
            {(skillId) => (
              <form.SubmitButton
                label="Agregar"
                formId={formId}
                disabled={skillId === 0}
              />
            )}
          </form.Subscribe>
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
