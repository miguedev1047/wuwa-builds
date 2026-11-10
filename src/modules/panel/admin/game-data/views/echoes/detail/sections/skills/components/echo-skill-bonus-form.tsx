import { useId } from "react"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { EchoSkillBonusRow } from "@db/schema"
import {
  echoSkillBonusFormInput,
  type EchoSkillBonusFormInput,
} from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import {
  createEchoSkillBonus,
  updateEchoSkillBonus,
} from "@game-data/server/echoes/skills"
import {
  EchoSkillBonusFields,
  echoSkillBonusFormDefaults,
} from "@panel/admin/game-data/views/echoes/detail/sections/skills/components/echo-skill-bonus-form-fields"
import { encoreCharacterQueries } from "@encore/queries/characters"

type EchoSkillBonusFormProps = {
  echoId: number
  /** Saved bonus when editing, `null` when creating. */
  bonus?: EchoSkillBonusRow | null
  onSaved: () => void
  onCancel: () => void
}

/** Creates or edits one skill bonus. */
export function EchoSkillBonusForm({
  echoId,
  bonus,
  onSaved,
  onCancel,
}: EchoSkillBonusFormProps) {
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
      toast.success(bonus ? "Bono actualizado" : "Bono agregado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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

  return (
    <>
      <form
        id={formId}
        className="mb-4"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <EchoSkillBonusFields
          form={form}
          isPending={isPending}
          characterOptions={characterOptions}
        />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>
        <form.AppForm>
          <form.SubmitButton
            label={bonus ? "Guardar" : "Agregar"}
            formId={formId}
          />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
