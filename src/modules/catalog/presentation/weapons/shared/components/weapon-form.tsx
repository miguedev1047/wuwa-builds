import { useEffect, useId, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { weaponInput, type WeaponInput } from "@catalog/application/schemas"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeapon } from "@catalog/server/weapons/weapons"
import { weaponDraftFromEncore } from "@catalog/application/weapons/weapon-draft"
import {
  WeaponFields,
  weaponFormDefaults,
} from "@catalog/presentation/weapons/shared/components/weapon-fields"
import { WeaponSearch } from "@catalog/presentation/weapons/shared/components/weapon-search"
import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import { encoreWeaponQueries } from "@encore/queries/catalogs"

export function WeaponForm() {
  const formId = `new-weapon-form-${useId()}`
  const { onCreated } = useCatalogActions()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<EncoreWeaponSummary | null>(null)

  const { data: encoreWeapon, isLoading: isEncoreLoading } = useQuery({
    ...encoreWeaponQueries.detail(selected?.id ?? 0),
    enabled: selected !== null,
  })

  const { mutateAsync, isPending: isMutationPending } = useMutation({
    mutationFn: (value: WeaponInput) => createWeapon({ data: value }),
    onSuccess: async (weapon) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapons(),
      })
      toast.success("Arma creada")

      await onCreated(weapon.id)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isPending = isMutationPending || isEncoreLoading

  const form = useAppForm({
    formId,
    defaultValues: weaponFormDefaults,
    validators: { onSubmit: weaponInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  useEffect(() => {
    if (!encoreWeapon) return

    form.reset(weaponDraftFromEncore(encoreWeapon))
  }, [encoreWeapon, form])

  return (
    <CatalogSection.Content>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <WeaponFields form={form} isPending={isPending} />
      </form>

      <div className="grid w-full grid-cols-2 gap-2">
        <WeaponSearch
          selectedId={selected?.id}
          onSelect={setSelected}
          disabled={isPending}
        />

        <form.AppForm>
          <form.SubmitButton
            label="Crear"
            formId={formId}
            disabled={isPending || !selected}
          />
        </form.AppForm>
      </div>
    </CatalogSection.Content>
  )
}
