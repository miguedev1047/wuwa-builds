import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import { weaponPropertyGrowthInput } from "@catalog/application/schemas"
import type { WeaponGrowthFormValues } from "@catalog/application/weapons/property-growth"

/** Empty values shared by every weapon growth form. */
export const weaponGrowthFormDefaults: WeaponGrowthFormValues = {
  propertyId: 0,
  sortOrder: 1,
  level: 1,
  value: "",
  encoreLevels: [],
}

/** Reusable fields of the weapon growth form. */
export const WeaponGrowthFields = withForm({
  defaultValues: weaponGrowthFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="level"
          validators={{ onSubmit: weaponPropertyGrowthInput.shape.level }}
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
          validators={{ onSubmit: weaponPropertyGrowthInput.shape.value }}
        >
          {(field) => (
            <field.TextField
              label="Valor"
              placeholder="412.50 o 16.05%"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
