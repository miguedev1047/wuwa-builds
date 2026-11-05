import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  resonatorSkillUpdateInput,
  type ResonatorSkillUpdateInput,
} from "@/modules/game-data/application/schemas"

/** Empty values shared by every resonator skill form. */
export const resonatorSkillFormDefaults: ResonatorSkillUpdateInput = {
  id: 0,
  resonatorId: 0,
  skillId: 0,
  sortOrder: 1,
  type: "",
  name: "",
  description: "",
  icon: "",
  media: "",
}

/** Reusable fields of the resonator skill form. */
export const ResonatorSkillFields = withForm({
  defaultValues: resonatorSkillFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="grid w-full gap-4">
        <form.AppField
          name="name"
          validators={{ onSubmit: resonatorSkillUpdateInput.shape.name }}
        >
          {(field) => (
            <field.TextField
              label="Nombre"
              placeholder="Floracion multiple"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="type"
          validators={{ onSubmit: resonatorSkillUpdateInput.shape.type }}
        >
          {(field) => (
            <field.TextField
              label="Tipo"
              placeholder="Ataque normal"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="description"
          validators={{ onSubmit: resonatorSkillUpdateInput.shape.description }}
        >
          {(field) => (
            <field.TextareaField
              label="Descripcion"
              placeholder="Descripcion de la habilidad"
              rows={6}
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField
          name="icon"
          validators={{ onSubmit: resonatorSkillUpdateInput.shape.icon }}
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

        <form.AppField
          name="media"
          validators={{ onSubmit: resonatorSkillUpdateInput.shape.media }}
        >
          {(field) => (
            <field.TextField
              label="Media"
              placeholder="https://api.encore.moe/resource/...mp4"
              inputMode="url"
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
