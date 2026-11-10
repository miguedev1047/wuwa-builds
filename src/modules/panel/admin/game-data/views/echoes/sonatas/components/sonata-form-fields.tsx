import { useSelector } from "@tanstack/react-form"
import { withForm } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import type { SonataFormInput } from "@game-data/application/schemas"
import { STAT_OPTIONS } from "@game-data/application/stats/stats"
import { Show } from "@/components/utility/show"

/** Piece thresholds a set can use. There is no 4-piece threshold. */
export const SONATA_PIECES_OPTIONS = [
  { label: "1 pieza", value: 1 },
  { label: "2 piezas", value: 2 },
  { label: "3 piezas", value: 3 },
  { label: "5 piezas", value: 5 },
]

export const sonataFormDefaults: SonataFormInput = {
  id: 0,
  name: "",
  icon: "",
  color: "",
  effects: [
    {
      pieces: 2,
      description: "",
      isConditional: false,
      statId: null,
      value: null,
    },
    {
      pieces: 5,
      description: "",
      isConditional: true,
      statId: null,
      value: null,
    },
  ],
}

type EffectSlot = "effects[0]" | "effects[1]"

/**
 * One effect slot of the sonata form.
 *
 * Conditional effects hide the stat and the value: the payload normalizer drops
 * them before the server validates, so the switch can never store a half
 * configured static bonus.
 */
const SonataEffectFields = withForm({
  defaultValues: sonataFormDefaults,
  props: {} as {
    slot: EffectSlot
    title: string
    isPending?: boolean
  },
  render: function Render({ form, slot, title, isPending }) {
    const isConditional = useSelector(form.store, (state) =>
      slot === "effects[0]"
        ? state.values.effects[0].isConditional
        : state.values.effects[1].isConditional
    )

    const hasThreePieces = useSelector(
      form.store,
      (state) => state.values.effects[0].pieces === 3
    )
    const hasOnePieces = useSelector(
      form.store,
      (state) => state.values.effects[0].pieces === 1
    )

    const isHidden = hasThreePieces || hasOnePieces

    if (slot === "effects[1]" && isHidden) return null

    return (
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 text-xs font-medium text-muted-foreground">
          {title}
        </legend>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <form.AppField name={`${slot}.pieces`}>
            {(field) => (
              <field.SelectField
                label="Piezas"
                options={SONATA_PIECES_OPTIONS}
                placeholder="Seleccionar piezas"
                className="md:col-span-2"
                disabled={isPending}
              />
            )}
          </form.AppField>

          <form.AppField name={`${slot}.isConditional`}>
            {(field) => (
              <field.SwitchField
                label="Condicional"
                description="Solo se activa en combate; el builder no lo suma."
                className="md:col-span-2"
                disabled={isPending}
              />
            )}
          </form.AppField>

          <Show when={!isConditional}>
            <>
              <form.AppField name={`${slot}.statId`}>
                {(field) => (
                  <field.SelectField
                    label="Estadística"
                    options={STAT_OPTIONS}
                    placeholder="Seleccionar estadística"
                    disabled={isPending}
                  />
                )}
              </form.AppField>

              <form.AppField name={`${slot}.value`}>
                {(field) => (
                  <field.NumberField
                    label="Valor %"
                    placeholder="10"
                    min={0}
                    step={0.1}
                    disabled={isPending}
                  />
                )}
              </form.AppField>
            </>{" "}
          </Show>

          <form.AppField name={`${slot}.description`}>
            {(field) => (
              <field.TextareaField
                label="Efecto"
                placeholder="Daño Gelio +10%"
                rows={3}
                className="md:col-span-2"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </fieldset>
    )
  },
})

export const SonataFields = withForm({
  defaultValues: sonataFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
  },
  render: function Render({ form, isPending }) {
    return (
      <FieldGroup className="gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label="Nombre"
                placeholder="Escarcha helada"
                disabled={isPending}
                className="md:col-span-2"
              />
            )}
          </form.AppField>

          <form.AppField name="icon">
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
        </div>

        <SonataEffectFields
          form={form}
          slot="effects[0]"
          title="Primer efecto"
          isPending={isPending}
        />

        <SonataEffectFields
          form={form}
          slot="effects[1]"
          title="Segundo efecto (opcional)"
          isPending={isPending}
        />
      </FieldGroup>
    )
  },
})
