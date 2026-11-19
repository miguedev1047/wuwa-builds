import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import type { ResonatorPropertyLevelInput } from "@catalog/application/schemas"
import {
  propertyLevelOptions,
  propertyLevelPayloads,
} from "@catalog/presentation/resonators/detail/application/property-level-draft"
import { propertyLevelFormDefaults } from "@catalog/presentation/resonators/detail/sections/levels/components/property-level-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorPropertyLevels } from "@catalog/server/resonators/properties"
import type { EncoreProperty } from "@encore/domain/property"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type PropertyLevelAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreProperties: EncoreProperty[]
  savedNames: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of property levels, rendered inside the add dialog. */
export function usePropertyLevelAddForm({
  resonatorId,
  sortOrder,
  encoreProperties,
  savedNames,
  onSaved,
  onCancel,
}: PropertyLevelAddFormProps) {
  const toast = useToast()

  const id = useId()
  const formId = `add-property-level-form-${id}`

  const queryClient = useQueryClient()
  const encoreOptions = propertyLevelOptions(encoreProperties, savedNames)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: ResonatorPropertyLevelInput[]) =>
      createResonatorPropertyLevels({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Propiedad agregada"
            : `${payloads.length} propiedades agregadas`,
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
    defaultValues: { ...propertyLevelFormDefaults, resonatorId, sortOrder },
    onSubmit: async ({ value }) => {
      await mutateAsync(propertyLevelPayloads(value, encoreOptions))
    },
  })

  const selectedProperties = useSelector(
    form.store,
    (state) => state.values.encoreProperties
  )
  const hasSelection = selectedProperties.length > 0

  return {
    formId,
    isPending,
    form,
    encoreOptions,
    selectedProperties,
    hasSelection,
    onCancel,
  }
}
