import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  resonatorMediaUpdateInput,
  type ResonatorMediaUpdateInput,
} from "@/modules/game-data/application/schemas"

/** Empty values shared by every resonator media form. */
export const resonatorMediaFormDefaults: ResonatorMediaUpdateInput = {
  id: 0,
  url: "",
}

/** Reusable fields of the resonator media form. */
export const ResonatorMediaFields = withForm({
  defaultValues: resonatorMediaFormDefaults,
  props: {} as {
    /** Disables the control while the mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup>
        <form.AppField
          name="url"
          validators={{ onSubmit: resonatorMediaUpdateInput.shape.url }}
        >
          {(field) => (
            <field.ImageField
              label="Imagen"
              description="URL de la imagen del resonador."
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
