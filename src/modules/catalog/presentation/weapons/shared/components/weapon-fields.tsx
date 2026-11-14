import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import { weaponInput, type WeaponInput } from "@catalog/application/schemas"
import {
  WEAPON_RARITY,
  WEAPON_TYPE_OPTIONS,
} from "@catalog/application/constants/weapon"

export const weaponFormDefaults: WeaponInput = {
  id: 0,
  name: "",
  rarity: 5,
  type: 1,
  icon: "",
  description: "",
}

export const WeaponFields = withForm({
  defaultValues: weaponFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4 md:grid-cols-2">
        <form.AppField
          name="name"
          validators={{ onSubmit: weaponInput.shape.name }}
        >
          {(field) => (
            <field.TextField
              label="Nombre del arma"
              placeholder="Maestro de cuerdas"
              className="md:col-span-2"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="rarity"
          validators={{ onSubmit: weaponInput.shape.rarity }}
        >
          {(field) => (
            <field.SelectField
              label="Rareza"
              options={WEAPON_RARITY}
              placeholder="Seleccionar rareza"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="type"
          validators={{ onSubmit: weaponInput.shape.type }}
        >
          {(field) => (
            <field.SelectField
              label="Tipo de arma"
              options={WEAPON_TYPE_OPTIONS}
              placeholder="Seleccionar tipo de arma"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="icon"
          validators={{ onSubmit: weaponInput.shape.icon }}
        >
          {(field) => (
            <field.ImageField
              label="Icono"
              placeholder="https://api-v2.encore.moe/resource/..."
              inputMode="url"
              className="md:col-span-2"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="description"
          validators={{ onSubmit: weaponInput.shape.description }}
        >
          {(field) => (
            <field.TextareaField
              label="Descripción"
              placeholder="Descripción del arma"
              rows={4}
              className="md:col-span-2"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
