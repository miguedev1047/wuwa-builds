import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  weaponPropertyInput,
  type WeaponPropertyInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { WEAPON_PROPERTY_NAMES } from "@/modules/panel/admin/game-data/views/weapons/shared/constants/weapon"

/** Empty values shared by every weapon property form. */
export const weaponPropertyFormDefaults: WeaponPropertyInput = {
  weaponId: 0,
  sortOrder: 1,
  name: "",
  baseValue: 0,
  icon: "",
}

/** Reusable fields of the weapon property form. */
export const WeaponPropertyFields = withForm({
  defaultValues: weaponPropertyFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="name"
          validators={{ onSubmit: weaponPropertyInput.shape.name }}
        >
          {(field) => (
            <field.SelectField
              label="Nombre"
              options={WEAPON_PROPERTY_NAMES}
              placeholder="Seleccionar propiedad"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="baseValue"
          validators={{ onSubmit: weaponPropertyInput.shape.baseValue }}
        >
          {(field) => (
            <field.NumberField
              label="Valor base"
              readOnly
              placeholder="33"
              min={0}
              step="any"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="icon"
          validators={{ onSubmit: weaponPropertyInput.shape.icon }}
        >
          {(field) => (
            <field.ImageField
              label="Icono"
              readOnly
              placeholder="https://api-v2.encore.moe/resource/..."
              inputMode="url"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
