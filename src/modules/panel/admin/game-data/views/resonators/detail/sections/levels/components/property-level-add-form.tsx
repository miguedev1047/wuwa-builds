import { useId, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EncoreProperty } from "@encore/domain/property"
import {
  resonatorPropertyLevelsSchema,
  type ResonatorPropertyLevelInput,
} from "@game-data/application/schemas"
import { statLabel } from "@game-data/application/stats/stats"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { createResonatorPropertyLevels } from "@game-data/server/resonators/properties"
import { propertyLevelDraftFromEncore } from "@panel/admin/game-data/views/resonators/detail/application/property-level-draft"
import {
  PropertyLevelFields,
  propertyLevelFormDefaults,
} from "@panel/admin/game-data/views/resonators/detail/sections/levels/components/property-level-form-fields"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"

type PropertyLevelAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreProperties: EncoreProperty[]
  savedNames: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a property level, rendered inside the add dialog. */
export function PropertyLevelAddForm({
  resonatorId,
  sortOrder,
  encoreProperties,
  savedNames,
  onSaved,
  onCancel,
}: PropertyLevelAddFormProps) {
  const id = useId()
  const formId = `add-property-level-form-${id}`
  const encoreFieldId = `add-property-level-encore-${id}`

  const [encoreName, setEncoreName] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: ResonatorPropertyLevelInput) =>
      createResonatorPropertyLevels({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.success("Propiedad agregada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...propertyLevelFormDefaults, resonatorId, sortOrder },
    validators: { onSubmit: resonatorPropertyLevelsSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  const encoreOptions = encoreProperties.flatMap((property) => {
    const draft = propertyLevelDraftFromEncore(property)

    if (savedNames.includes(draft.name)) {
      return []
    }

    return [{ label: statLabel(draft.name), value: property.name, draft }]
  })

  return (
    <>
      <Show when={encoreOptions.length > 0}>
        <Field>
          <FieldLabel htmlFor={encoreFieldId}>
            Autocompletado inteligente
          </FieldLabel>

          <Select
            items={encoreOptions}
            value={encoreName}
            disabled={isPending}
            onValueChange={(value) => {
              if (value === null) return

              const option = encoreOptions.find((item) => item.value === value)

              if (!option) return

              form.reset({
                ...propertyLevelFormDefaults,
                resonatorId,
                sortOrder,
                ...option.draft,
              })

              setEncoreName(null)
            }}
          >
            <SelectTrigger id={encoreFieldId} className="w-full">
              <SelectValue placeholder="Elegir propiedad de Encore" />
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
            Copia el valor base y el icono del resonador.
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
        <PropertyLevelFields form={form} isPending={isPending} />
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
