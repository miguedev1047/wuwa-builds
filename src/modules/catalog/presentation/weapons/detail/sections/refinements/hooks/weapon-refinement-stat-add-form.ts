import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  weaponRefinementStatsFormInput,
  type WeaponRefinementStatInput,
} from "@catalog/application/schemas"
import { weaponStatPayloads } from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"
import { weaponRefinementStatFormDefaults } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-stat-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeaponRefinementStats } from "@catalog/server/weapons/refinement-stats"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type WeaponRefinementStatAddFormProps = {
  refinementId: number
  weaponId: number
  sortOrder: number
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more refinement stats. */
export function useWeaponRefinementStatAddForm({
  refinementId,
  weaponId,
  sortOrder,
  onSaved,
  onCancel,
}: WeaponRefinementStatAddFormProps) {
  const toast = useToast()

  const formId = `add-weapon-refinement-stats-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: WeaponRefinementStatInput[]) =>
      createWeaponRefinementStats({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Estadística agregada"
            : `${payloads.length} estadísticas agregadas`,
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
    defaultValues: {
      ...weaponRefinementStatFormDefaults,
      refinementId,
      sortOrder,
    },
    validators: { onSubmit: weaponRefinementStatsFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(weaponStatPayloads(value))
    },
  })

  return { formId, isPending, form, onCancel }
}
