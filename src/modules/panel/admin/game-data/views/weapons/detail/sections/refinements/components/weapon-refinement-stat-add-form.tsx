import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  weaponRefinementStatsFormInput,
  type WeaponRefinementStatInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createWeaponRefinementStats } from "@/modules/panel/admin/game-data/server/weapons/refinement-stats"
import { weaponStatPayloads } from "@/modules/panel/admin/game-data/views/weapons/detail/application/weapon-refinement-draft"
import {
  WeaponRefinementStatFields,
  weaponRefinementStatFormDefaults,
} from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-form-fields"

type WeaponRefinementStatAddFormProps = {
  refinementId: number
  weaponId: number
  sortOrder: number
  onSaved: () => void
  onCancel: () => void
}

/** Create form of one or more refinement stats. */
export function WeaponRefinementStatAddForm({
  refinementId,
  weaponId,
  sortOrder,
  onSaved,
  onCancel,
}: WeaponRefinementStatAddFormProps) {
  const formId = `add-weapon-refinement-stats-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: WeaponRefinementStatInput[]) =>
      createWeaponRefinementStats({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.success(
        payloads.length === 1
          ? "Estadística agregada"
          : `${payloads.length} estadísticas agregadas`
      )
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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
        <WeaponRefinementStatFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton label="Crear" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
