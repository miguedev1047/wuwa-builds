import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { WeaponRow } from "@/db/schema"
import {
  weaponInput,
  type WeaponInput,
} from "@/modules/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { updateWeapon } from "@/modules/game-data/server/weapons/weapons"
import { weaponDraftFromRow } from "@/modules/panel/admin/game-data/views/weapons/shared/application/weapon-draft"
import { WeaponFields } from "@/modules/panel/admin/game-data/views/weapons/shared/components/weapon-fields"

type WeaponEditFormProps = {
  weapon: WeaponRow
  onSaved: () => void
  onCancel: () => void
}

export function WeaponEditForm({
  weapon,
  onSaved,
  onCancel,
}: WeaponEditFormProps) {
  const formId = `edit-weapon-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponInput) => updateWeapon({ data: value }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.weapons(),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.weapon(updated.id),
        }),
      ])
      toast.success("Arma actualizada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: weaponDraftFromRow(weapon),
    validators: { onSubmit: weaponInput },
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
        className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"
      >
        <WeaponFields form={form} isPending={isPending} />
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
