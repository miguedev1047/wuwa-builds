import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  growthMilestoneOptions,
  propertyGrowthPayloads,
  type PropertyGrowthPayload,
} from "@catalog/application/resonators/property-growth"
import { propertyGrowthFormDefaults } from "@catalog/presentation/resonators/detail/sections/levels/components/property-growth-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createResonatorPropertyGrowth } from "@catalog/server/resonators/property-growth"
import type { ResonatorPropertyGrowthRow } from "@db/schema"
import type { EncorePropertyGrowth } from "@encore/domain/property"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

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
export function usePropertyGrowthAddForm({
  propertyId,
  resonatorId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
  onSaved,
  onCancel,
}: PropertyGrowthAddFormProps) {
  const toast = useToast()

  const id = useId()
  const formId = `add-property-growth-form-${id}`

  const queryClient = useQueryClient()
  const encoreOptions = growthMilestoneOptions(encoreGrowth, savedGrowth)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: PropertyGrowthPayload[]) =>
      createResonatorPropertyGrowth({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Nivel agregado"
            : `${payloads.length} niveles agregados`,
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

  return {
    id,
    formId,
    isPending,
    form,
    encoreOptions,
    encoreLevels,
    hasSelection,
    onCancel,
  }
}
