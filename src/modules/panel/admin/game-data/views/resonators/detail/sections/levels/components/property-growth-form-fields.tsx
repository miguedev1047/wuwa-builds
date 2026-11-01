import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  resonatorPropertyGrowthInput,
  type ResonatorPropertyGrowthInput,
} from "@/modules/panel/admin/game-data/application/schemas"

/** Empty values shared by every property growth form. */
export const propertyGrowthFormDefaults: ResonatorPropertyGrowthInput = {
  propertyId: 0,
  sortOrder: 1,
  level: 1,
  value: "",
}

/** Reusable fields of the property growth form. */
export const PropertyGrowthFields = withForm({
  defaultValues: propertyGrowthFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="level"
          validators={{ onSubmit: resonatorPropertyGrowthInput.shape.level }}
        >
          {(field) => (
            <field.NumberField
              label="Nivel"
              placeholder="90"
              min={1}
              max={90}
              step={1}
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="value"
          validators={{ onSubmit: resonatorPropertyGrowthInput.shape.value }}
        >
          {(field) => (
            <field.TextField
              label="Valor"
              placeholder="824 o 5%"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
