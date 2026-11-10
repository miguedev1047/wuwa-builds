import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import { echoInput, type EchoInput } from "@game-data/application/schemas"
import {
  ECHO_CLASS_OPTIONS,
  ECHO_COST_OPTIONS,
} from "@panel/admin/game-data/views/echoes/shared/constants/echo"

export const echoFormDefaults: EchoInput = {
  id: 0,
  name: "",
  class: 0,
  cost: 1,
  icon: "",
}

export const EchoFields = withForm({
  defaultValues: echoFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4 md:grid-cols-2">
        <form.AppField
          name="name"
          validators={{ onSubmit: echoInput.shape.name }}
        >
          {(field) => (
            <field.TextField
              label="Nombre del eco"
              placeholder="Geochelone Portacampana"
              className="md:col-span-2"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="class"
          validators={{ onSubmit: echoInput.shape.class }}
        >
          {(field) => (
            <field.SelectField
              label="Clase"
              options={ECHO_CLASS_OPTIONS}
              placeholder="Seleccionar clase"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="cost"
          validators={{ onSubmit: echoInput.shape.cost }}
        >
          {(field) => (
            <field.SelectField
              label="Coste"
              options={ECHO_COST_OPTIONS}
              placeholder="Seleccionar coste"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="icon"
          validators={{ onSubmit: echoInput.shape.icon }}
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
      </FieldGroup>
    )
  },
})
