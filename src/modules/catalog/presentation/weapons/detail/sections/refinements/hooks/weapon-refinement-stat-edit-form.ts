import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  weaponRefinementStatsFormInput,
  type WeaponRefinementStatsFormValues,
} from "@catalog/application/schemas"
import { weaponStatDraftFromRow } from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateWeaponRefinementStat } from "@catalog/server/weapons/refinement-stats"
import type { WeaponRefinementStatRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type WeaponRefinementStatEditFormProps = {
  stat: WeaponRefinementStatRow
  weaponId: number
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a single refinement stat. */
export function useWeaponRefinementStatEditForm({
  stat,
  weaponId,
  onSaved,
  onCancel,
}: WeaponRefinementStatEditFormProps) {
  const toast = useToast()

  const formId = `edit-weapon-refinement-stat-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponRefinementStatsFormValues) => {
      const row = value.stats[0]

      if (!row) {
        throw new Error("Agrega una estadistica")
      }

      return updateWeaponRefinementStat({
        data: {
          id: stat.id,
          refinementId: value.refinementId,
          sortOrder: value.sortOrder,
          statName: row.statName,
          statNumber: row.value,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.add({ title: "Estadística actualizada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: {
      refinementId: stat.refinementId,
      sortOrder: stat.sortOrder,
      stats: [weaponStatDraftFromRow(stat)],
    },
    validators: { onSubmit: weaponRefinementStatsFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}
