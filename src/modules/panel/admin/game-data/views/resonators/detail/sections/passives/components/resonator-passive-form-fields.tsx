import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  resonatorPassiveUpdateInput,
  type ResonatorPassiveUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"

/** Empty values shared by every resonator passive form. */
export const resonatorPassiveFormDefaults: ResonatorPassiveUpdateInput = {
  id: 0,
  resonatorId: 0,
  passiveId: 0,
  sortOrder: 1,
  title: "",
  description: "",
  icon: "",
}

/** Reusable fields of the resonator passive form. */
export const ResonatorPassiveFields = withForm({
  defaultValues: resonatorPassiveFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="title"
          validators={{ onSubmit: resonatorPassiveUpdateInput.shape.title }}
        >
          {(field) => (
            <field.TextField
              label="Titulo"
              placeholder="ATQ+"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="description"
          validators={{
            onSubmit: resonatorPassiveUpdateInput.shape.description,
          }}
        >
          {(field) => (
            <field.TextareaField
              label="Descripcion"
              placeholder="Descripcion de la pasiva"
              rows={6}
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="icon"
          validators={{ onSubmit: resonatorPassiveUpdateInput.shape.icon }}
        >
          {(field) => (
            <field.ImageField
              label="Icono"
              placeholder="https://api.encore.moe/resource/..."
              inputMode="url"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
