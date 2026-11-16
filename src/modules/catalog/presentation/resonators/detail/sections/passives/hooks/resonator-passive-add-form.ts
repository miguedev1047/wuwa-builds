import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import type { ResonatorPassiveInput } from "@catalog/application/schemas"
import { resonatorPassivePayloads } from "@catalog/presentation/resonators/detail/application/resonator-passive-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorPassives } from "@catalog/server/resonators/passives"
import type { EncorePassive } from "@encore/domain/character"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorPassiveAddFormProps = {
  resonatorId: number
  sortOrder: number
  encorePassives: EncorePassive[]
  savedPassiveIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more resonator passives. */
export function useResonatorPassiveAddForm({
  resonatorId,
  sortOrder,
  encorePassives,
  savedPassiveIds,
  onSaved,
  onCancel,
}: ResonatorPassiveAddFormProps) {
  const toast = useToast()

  const formId = `add-resonator-passives-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: ResonatorPassiveInput[]) =>
      createResonatorPassives({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Pasiva agregada"
            : `${payloads.length} pasivas agregadas`,
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
    defaultValues: { passiveIds: [] as string[] },
    validators: {
      onSubmit: ({ value }) =>
        value.passiveIds.length === 0
          ? "Selecciona al menos una pasiva"
          : undefined,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        resonatorPassivePayloads(
          value.passiveIds,
          encorePassives,
          resonatorId,
          sortOrder
        )
      )
    },
  })

  const options = encorePassives
    .filter((passive) => !savedPassiveIds.includes(passive.id))
    .map((passive) => ({
      label: passive.title,
      value: String(passive.id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return { formId, isPending, form, options, onCancel }
}
