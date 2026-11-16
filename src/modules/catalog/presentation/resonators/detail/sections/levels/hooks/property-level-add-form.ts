import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  resonatorPropertyLevelsSchema,
  type ResonatorPropertyLevelInput,
} from "@catalog/application/schemas"
import { statLabel } from "@catalog/application/stats/stats"
import { propertyLevelDraftFromEncore } from "@catalog/presentation/resonators/detail/application/property-level-draft"
import { propertyLevelFormDefaults } from "@catalog/presentation/resonators/detail/sections/levels/components/property-level-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorPropertyLevels } from "@catalog/server/resonators/properties"
import type { EncoreProperty } from "@encore/domain/property"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"

type PropertyLevelAddFormProps = {
  resonatorId: number
  sortOrder: number
  encoreProperties: EncoreProperty[]
  savedNames: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a property level, rendered inside the add dialog. */
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
      toast.add({ title: "Propiedad agregada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

  return {
    encoreFieldId,
    encoreName,
    setEncoreName,
    encoreOptions,
    formId,
    isPending,
    form,
    onCancel,
  }
}
