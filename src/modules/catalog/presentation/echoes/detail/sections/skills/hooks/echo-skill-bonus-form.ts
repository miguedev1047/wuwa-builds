import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  echoSkillBonusFormInput,
  type EchoSkillBonusFormInput,
} from "@catalog/application/schemas"
import { echoSkillBonusFormDefaults } from "@catalog/presentation/echoes/detail/sections/skills/components/echo-skill-bonus-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import {
  createEchoSkillBonus,
  updateEchoSkillBonus,
} from "@catalog/server/echoes/skills"
import type { EchoSkillBonusRow } from "@db/schema"
import { encoreCharacterQueries } from "@encore/queries/characters"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useId } from "react"

type EchoSkillBonusFormProps = {
  echoId: number
  /** Saved bonus when editing, `null` when creating. */
  bonus?: EchoSkillBonusRow | null
  onSaved: () => void
  onCancel: () => void
}

/** Creates or edits one skill bonus. */
export function useEchoSkillBonusForm({
  echoId,
  bonus,
  onSaved,
  onCancel,
}: EchoSkillBonusFormProps) {
  const toast = useToast()

  const formId = `echo-skill-bonus-form-${useId()}`
  const queryClient = useQueryClient()
  const { data: characters } = useSuspenseQuery(encoreCharacterQueries.list())

  const characterOptions = characters.map((character) => ({
    label: character.name,
    value: character.id,
  }))

  const defaults: EchoSkillBonusFormInput = bonus
    ? {
        id: bonus.id,
        echoId,
        statId: bonus.statId,
        value: bonus.value,
        requiresMainSlot: bonus.requiresMainSlot,
        condition: bonus.condition as EchoSkillBonusFormInput["condition"],
        conditionValue: bonus.conditionValue,
      }
    : echoSkillBonusFormDefaults(echoId)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: EchoSkillBonusFormInput) =>
      bonus
        ? updateEchoSkillBonus({
            data: { ...value, id: value.id },
          })
        : createEchoSkillBonus({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.add({
        title: bonus ? "Bono actualizado" : "Bono agregado",
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
    defaultValues: defaults,
    validators: { onSubmit: echoSkillBonusFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, characterOptions, isPending, form, bonus, onCancel }
}
