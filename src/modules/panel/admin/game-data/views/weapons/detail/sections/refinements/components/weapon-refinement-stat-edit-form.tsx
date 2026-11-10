import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { WeaponRefinementStatRow } from "@db/schema"
import {
  weaponRefinementStatsFormInput,
  type WeaponRefinementStatsFormValues,
} from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { updateWeaponRefinementStat } from "@game-data/server/weapons/refinement-stats"
import { weaponStatDraftFromRow } from "@panel/admin/game-data/views/weapons/detail/application/weapon-refinement-draft"
import { WeaponRefinementStatFields } from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-form-fields"

type WeaponRefinementStatEditFormProps = {
  stat: WeaponRefinementStatRow
  weaponId: number
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a single refinement stat. */
export function WeaponRefinementStatEditForm({
  stat,
  weaponId,
  onSaved,
  onCancel,
}: WeaponRefinementStatEditFormProps) {
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
      toast.success("Estadística actualizada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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

  return (
    <>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[50vh] space-y-4 overflow-y-auto px-4"
      >
        <WeaponRefinementStatFields
          form={form}
          isPending={isPending}
          allowAdd={false}
        />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton label="Guardar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
