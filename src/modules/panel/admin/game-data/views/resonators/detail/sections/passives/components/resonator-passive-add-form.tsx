import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { EncorePassive } from "@encore/domain/character"
import type { ResonatorPassiveInput } from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { createResonatorPassives } from "@game-data/server/resonators/passives"
import { resonatorPassivePayloads } from "@panel/admin/game-data/views/resonators/detail/application/resonator-passive-draft"

type ResonatorPassiveAddFormProps = {
  resonatorId: number
  sortOrder: number
  encorePassives: EncorePassive[]
  savedPassiveIds: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more resonator passives. */
export function ResonatorPassiveAddForm({
  resonatorId,
  sortOrder,
  encorePassives,
  savedPassiveIds,
  onSaved,
  onCancel,
}: ResonatorPassiveAddFormProps) {
  const formId = `add-resonator-passives-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: ResonatorPassiveInput[]) =>
      createResonatorPassives({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success(
        payloads.length === 1
          ? "Pasiva agregada"
          : `${payloads.length} pasivas agregadas`
      )
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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
        <form.AppField name="passiveIds">
          {(field) => (
            <field.MultiComboboxField
              label="Autocompletado inteligente"
              description="Copia las pasivas del resonador en Encore."
              options={options}
              placeholder="Agregar pasiva"
              emptyMessage="Sin pasivas disponibles"
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
          <form.Subscribe selector={(state) => state.values.passiveIds}>
            {(passiveIds) => (
              <form.SubmitButton
                label="Agregar"
                formId={formId}
                disabled={passiveIds.length === 0}
              />
            )}
          </form.Subscribe>
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
