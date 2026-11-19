import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"

import {
  RESONATOR_ELEMENTS,
  RESONATOR_RARITY,
  RESONATOR_WEAPON_TYPES,
} from "@catalog/application/constants/resonator"
import {
  resonatorFormInput,
  type ResonatorFormValues,
} from "@catalog/application/schemas"

export const resonatorFormDefaults: ResonatorFormValues = {
  id: 0,
  name: "",
  introduction: "",
  rarity: 5,
  element: "",
  weaponType: "",
  icon: "",
  card: "",
  circle: "",
  portrait: "",
  iconLarge: "",
  isVisible: true,
  isNew: false,
  isCollab: false,
}

export const ResonatorFields = withForm({
  defaultValues: resonatorFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4 md:grid-cols-2">
        <form.AppField
          name="name"
          validators={{ onSubmit: resonatorFormInput.shape.name }}
        >
          {(field) => (
            <field.TextField
              label="Nombre del resonador"
              placeholder="Cartethyia"
              disabled={isPending}
              className="md:col-span-2"
            />
          )}
        </form.AppField>

        <form.AppField
          name="rarity"
          validators={{ onSubmit: resonatorFormInput.shape.rarity }}
        >
          {(field) => (
            <field.SelectField
              label="Rareza"
              options={RESONATOR_RARITY}
              placeholder="Seleccionar rareza"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="element"
          validators={{ onSubmit: resonatorFormInput.shape.element }}
        >
          {(field) => (
            <field.SelectField
              label="Elemento"
              options={RESONATOR_ELEMENTS}
              placeholder="Seleccionar elemento"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="weaponType"
          validators={{ onSubmit: resonatorFormInput.shape.weaponType }}
        >
          {(field) => (
            <field.SelectField
              label="Tipo de arma"
              options={RESONATOR_WEAPON_TYPES}
              placeholder="Seleccionar tipo de arma"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="introduction"
          validators={{ onSubmit: resonatorFormInput.shape.introduction }}
        >
          {(field) => (
            <field.TextareaField
              label="Descripción"
              placeholder="Descripción del resonador"
              rows={4}
              className="md:col-span-2"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField name="isVisible">
          {(field) => (
            <field.SwitchField
              className="md:col-span-2"
              label="Visible en el builder"
              description="Los resonadores ocultos solo se curan aquí."
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField name="isNew">
          {(field) => (
            <field.SwitchField
              className="md:col-span-2"
              label="Nuevo"
              description="Lanzamiento reciente de la versión actual."
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField name="isCollab">
          {(field) => (
            <field.SwitchField
              className="md:col-span-2"
              label="Colab"
              description="Resonador de una colaboración."
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
