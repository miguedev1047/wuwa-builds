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
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import {
  weaponRefinementFormInput,
  type WeaponRefinementInput,
} from "@game-data/application/schemas"
import { wuwaBuildsKeys } from "@game-data/queries/keys"
import { createWeaponRefinement } from "@game-data/server/weapons/refinements"
import { weaponRefinementDraftFromEncore } from "@panel/admin/game-data/views/weapons/detail/application/weapon-refinement-draft"
import {
  WeaponRefinementFields,
  weaponRefinementFormDefaults,
} from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"

type WeaponRefinementAddFormProps = {
  weaponId: number
  sortOrder: number
  encoreRefinements: EncoreWeaponRefinement[]
  savedRanks: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a weapon refinement, rendered inside the add dialog. */
export function WeaponRefinementAddForm({
  weaponId,
  sortOrder,
  encoreRefinements,
  savedRanks,
  onSaved,
  onCancel,
}: WeaponRefinementAddFormProps) {
  const id = useId()
  const formId = `add-weapon-refinement-form-${id}`
  const encoreFieldId = `add-weapon-refinement-encore-${id}`

  const [encoreName, setEncoreName] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponRefinementInput) =>
      createWeaponRefinement({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.success("Refinamiento creado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...weaponRefinementFormDefaults, weaponId, sortOrder },
    validators: { onSubmit: weaponRefinementFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  const encoreOptions = encoreRefinements.flatMap((refinement) => {
    if (savedRanks.includes(refinement.rank)) return []

    return [
      {
        label: `Refinamiento ${refinement.rank} — ${refinement.name}`,
        value: String(refinement.rank),
        draft: weaponRefinementDraftFromEncore(refinement),
      },
    ]
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
                ...weaponRefinementFormDefaults,
                weaponId,
                ...option.draft,
              })

              setEncoreName(null)
            }}
          >
            <SelectTrigger id={encoreFieldId} className="w-full">
              <SelectValue placeholder="Elegir refinamiento de Encore" />
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
            Copia el nombre, el rango y el efecto del arma.
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
        <WeaponRefinementFields form={form} isPending={isPending} />
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
