import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  resonatorPropertyLevelsSchema,
  type ResonatorPropertyLevelInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { RESONATOR_PROPERTY_NAMES } from "@/modules/panel/admin/game-data/views/resonators/shared/constants/resonator"

/** Empty values shared by every property level form. */
export const propertyLevelFormDefaults: ResonatorPropertyLevelInput = {
  resonatorId: 0,
  sortOrder: 1,
  name: "",
  baseValue: 0,
  icon: "",
}

/** Reusable fields of the property level form. */
export const PropertyLevelFields = withForm({
  defaultValues: propertyLevelFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="name"
          validators={{ onSubmit: resonatorPropertyLevelsSchema.shape.name }}
        >
          {(field) => (
            <field.SelectField
              label="Nombre"
              options={RESONATOR_PROPERTY_NAMES}
              placeholder="Seleccionar propiedad"
              disabled
            />
          )}
        </form.AppField>

        <form.AppField
          name="baseValue"
          validators={{
            onSubmit: resonatorPropertyLevelsSchema.shape.baseValue,
          }}
        >
          {(field) => (
            <field.NumberField
              label="Valor base"
              readOnly
              placeholder="831"
              min={0}
              step="any"
              disabled
            />
          )}
        </form.AppField>

        <form.AppField
          name="icon"
          validators={{ onSubmit: resonatorPropertyLevelsSchema.shape.icon }}
        >
          {(field) => (
            <field.ImageField
              label="Icono"
              readOnly
              placeholder="https://api-v2.encore.moe/resource/..."
              inputMode="url"
              disabled
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
