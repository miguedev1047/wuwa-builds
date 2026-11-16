import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useId } from "react"

import {
  echoSkillInput,
  type EchoSkillInput,
} from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { upsertEchoSkill } from "@catalog/server/echoes/skills"
import type { EchoSkillRow } from "@db/schema"
import { encoreEchoQueries } from "@encore/queries/catalogs"

type EchoSkillTextFormProps = {
  echoId: number
  skill: EchoSkillRow | null
  onSaved: () => void
  onCancel: () => void
}

/** Edits the skill text, prefilled from Encore when there is no saved row. */
export function useEchoSkillTextForm({
  echoId,
  skill,
  onSaved,
  onCancel,
}: EchoSkillTextFormProps) {
  const toast = useToast()

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
      toast.add({ title: "Habilidad guardada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

  return { formId, isPending, form, onCancel }
}
