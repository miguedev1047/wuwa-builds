import { useId, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ResonatorPropertyGrowthRow } from "@/db/schema"
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
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"
import { growthMilestoneOptions } from "@/modules/panel/admin/game-data/application/property-growth"
import {
  resonatorPropertyGrowthInput,
  type ResonatorPropertyGrowthInput,
} from "@/modules/panel/admin/game-data/application/schemas"
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
  const encoreFieldId = `add-property-growth-encore-${id}`

  const [encoreIndex, setEncoreIndex] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorPropertyGrowthInput) =>
      createResonatorPropertyGrowth({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Nivel agregado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...propertyGrowthFormDefaults, propertyId, sortOrder },
    validators: { onSubmit: resonatorPropertyGrowthInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  const encoreOptions = growthMilestoneOptions(encoreGrowth, savedGrowth)

  return (
    <>
      <Show when={encoreOptions.length > 0}>
        <Field>
          <FieldLabel htmlFor={encoreFieldId}>
            Autocompletado inteligente
          </FieldLabel>

          <Select
            items={encoreOptions}
            value={encoreIndex}
            disabled={isPending}
            onValueChange={(value) => {
              if (value === null) return

              const option = encoreOptions.find((item) => item.value === value)

              if (!option) return

              form.reset({
                ...propertyGrowthFormDefaults,
                propertyId,
                sortOrder,
                level: option.entry.level,
                value: String(option.entry.value),
              })

              setEncoreIndex(null)
            }}
          >
            <SelectTrigger id={encoreFieldId} className="w-full">
              <SelectValue placeholder="Elegir nivel de Encore" />
            </SelectTrigger>

            <SelectContent>
              {encoreOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldDescription>
            Copia el nivel y el valor del resonador en Encore.
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
        <PropertyGrowthFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton label="Agregar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
