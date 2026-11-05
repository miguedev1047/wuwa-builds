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
import { FieldGroup } from "@/components/ui/field"
import type { EchoSkillRow } from "@/db/schema"
import {
  echoSkillInput,
  type EchoSkillInput,
} from "@/modules/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { upsertEchoSkill } from "@/modules/game-data/server/echoes/skills"
import { encoreEchoQueries } from "@/modules/encore/queries/catalogs"

type EchoSkillTextFormProps = {
  echoId: number
  skill: EchoSkillRow | null
  onSaved: () => void
  onCancel: () => void
}

/** Edits the skill text, prefilled from Encore when there is no saved row. */
export function EchoSkillTextForm({
  echoId,
  skill,
  onSaved,
  onCancel,
}: EchoSkillTextFormProps) {
  const formId = `echo-skill-text-form-${useId()}`
  const queryClient = useQueryClient()
  const { data: encore } = useSuspenseQuery(encoreEchoQueries.detail(echoId))

  const defaults: EchoSkillInput = {
    echoId,
    description: skill?.description ?? encore.skill?.description ?? "",
    simpleDescription:
      skill?.simpleDescription ?? encore.skill?.simpleDescription ?? "",
    icon: skill?.icon ?? encore.skill?.icon ?? "",
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: EchoSkillInput) => upsertEchoSkill({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.success("Habilidad guardada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: defaults,
    validators: { onSubmit: echoSkillInput },
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
        className="mb-4"
      >
        <FieldGroup className="gap-4">
          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Descripción"
                placeholder="Invoca ..."
                rows={8}
                disabled={isPending}
              />
            )}
          </form.AppField>

          <form.AppField name="simpleDescription">
            {(field) => (
              <field.TextareaField
                label="Descripción corta"
                placeholder="Resumen de la habilidad"
                rows={3}
                disabled={isPending}
              />
            )}
          </form.AppField>

          <form.AppField name="icon">
            {(field) => (
              <field.ImageField
                label="Icono"
                placeholder="https://api-v2.encore.moe/resource/..."
                inputMode="url"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </FieldGroup>
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
