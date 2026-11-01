import { useId } from "react"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ResonatorPropertyGrowthRow } from "@/db/schema"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"
import {
  growthMilestoneOptions,
  propertyGrowthPayloads,
  type PropertyGrowthPayload,
} from "@/modules/panel/admin/game-data/application/property-growth"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createResonatorPropertyGrowth } from "@/modules/panel/admin/game-data/server/property-growth"
import {
  PropertyGrowthFields,
  propertyGrowthFormDefaults,
} from "@/modules/panel/admin/game-data/views/resonators/detail/sections/levels/components/property-growth-form-fields"

type PropertyGrowthAddFormProps = {
  propertyId: number
  resonatorId: number
  sortOrder: number
  encoreGrowth: EncorePropertyGrowth[]
  savedGrowth: ResonatorPropertyGrowthRow[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a property growth entry, rendered inside the add dialog. */
export function PropertyGrowthAddForm({
  propertyId,
  resonatorId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
  onSaved,
  onCancel,
}: PropertyGrowthAddFormProps) {
  const id = useId()
  const formId = `add-property-growth-form-${id}`

  const queryClient = useQueryClient()
  const encoreOptions = growthMilestoneOptions(encoreGrowth, savedGrowth)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: PropertyGrowthPayload[]) =>
      Promise.all(
        payloads.map((data) => createResonatorPropertyGrowth({ data }))
      ),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success(
        payloads.length === 1
          ? "Nivel agregado"
          : `${payloads.length} niveles agregados`
      )
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...propertyGrowthFormDefaults, propertyId, sortOrder },
    onSubmit: async ({ value }) => {
      await mutateAsync(propertyGrowthPayloads(value, encoreOptions))
    },
  })

  const encoreLevels = useSelector(
    form.store,
    (state) => state.values.encoreLevels
  )
  const hasSelection = encoreLevels.length > 0

  return (
    <>
      <Show when={encoreOptions.length > 0}>
        <form.AppField name="encoreLevels">
          {(field) => (
            <field.SelectMultipleField
              label="Autocompletado inteligente"
              description="Copia los niveles y valores del resonador en Encore."
              options={encoreOptions.map(({ label, value }) => ({
                label,
                value,
              }))}
              placeholder="Elegir niveles de Encore"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </Show>

      <Show when={!hasSelection}>
        <Separator />
      </Show>

      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[50vh] space-y-4 overflow-y-auto px-4"
      >
        <Show when={!hasSelection}>
          <PropertyGrowthFields form={form} isPending={isPending} />
        </Show>
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton
            label={encoreLevels.length > 1 ? "Agregar niveles" : "Agregar"}
            formId={formId}
          />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
