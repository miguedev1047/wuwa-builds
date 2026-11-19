import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"

import { WEAPON_REFINEMENT_RANKS } from "@catalog/application/constants/weapon"
import { weaponRefinementUpdateInput } from "@catalog/application/schemas"
import type { WeaponRefinementFormValues } from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"

/** Empty values shared by every refinement form. */
export const weaponRefinementFormDefaults: WeaponRefinementFormValues = {
  id: 0,
  weaponId: 0,
  sortOrder: 1,
  name: "",
  effect: "",
  encoreRefinements: [],
}

/** Reusable fields of the weapon refinement form. */
export const WeaponRefinementFields = withForm({
  defaultValues: weaponRefinementFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="name"
          validators={{ onSubmit: weaponRefinementUpdateInput.shape.name }}
        >
          {(field) => (
            <field.TextField
              label="Nombre"
              placeholder="Amplificación eléctrica"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="sortOrder"
          validators={{ onSubmit: weaponRefinementUpdateInput.shape.sortOrder }}
        >
          {(field) => (
            <field.SelectField
              label="Rango"
              options={WEAPON_REFINEMENT_RANKS}
              placeholder="Seleccionar rango"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="effect"
          validators={{ onSubmit: weaponRefinementUpdateInput.shape.effect }}
        >
          {(field) => (
            <field.TextareaField
              label="Efecto"
              placeholder="Efecto del refinamiento"
              rows={8}
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
