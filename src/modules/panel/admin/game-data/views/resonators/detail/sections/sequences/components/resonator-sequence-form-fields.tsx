import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  resonatorSequenceUpdateInput,
  type ResonatorSequenceUpdateInput,
} from "@/modules/game-data/application/schemas"
import { RESONATOR_SEQUENCE } from "@/modules/game-data/application/constants/resonator"

/** Empty values shared by every resonator sequence form. */
export const resonatorSequenceFormDefaults: ResonatorSequenceUpdateInput = {
  id: 0,
  resonatorId: 0,
  sequenceId: 0,
  sortOrder: 1,
  index: 1,
  name: "",
  description: "",
}

/** Reusable fields of the resonator sequence form. */
export const ResonatorSequenceFields = withForm({
  defaultValues: resonatorSequenceFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="index"
          validators={{ onSubmit: resonatorSequenceUpdateInput.shape.index }}
        >
          {(field) => (
            <field.SelectField
              label="Secuencia"
              options={RESONATOR_SEQUENCE}
              placeholder="Seleccionar secuencia"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="name"
          validators={{ onSubmit: resonatorSequenceUpdateInput.shape.name }}
        >
          {(field) => (
            <field.TextField
              label="Nombre"
              placeholder="Bote, rompe la marea creciente"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="description"
          validators={{
            onSubmit: resonatorSequenceUpdateInput.shape.description,
          }}
        >
          {(field) => (
            <field.TextareaField
              label="Descripcion"
              placeholder="Descripcion de la secuencia"
              rows={6}
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
