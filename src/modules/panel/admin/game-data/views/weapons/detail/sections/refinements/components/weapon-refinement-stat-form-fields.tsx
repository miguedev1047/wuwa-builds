import { withForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Show } from "@/components/utility/show"
import {
  weaponRefinementStatRowInput,
  type WeaponRefinementStatsFormValues,
} from "@game-data/application/schemas"
import { WEAPON_REFINEMENT_STAT_OPTIONS } from "@game-data/application/weapons/refinement-stats"

/** Empty values shared by every refinement stat form. */
export const weaponRefinementStatFormDefaults: WeaponRefinementStatsFormValues =
  {
    refinementId: 0,
    sortOrder: 1,
    stats: [{ statName: "", value: 0 }],
  }

/** Reusable array fields of the refinement stat form. */
export const WeaponRefinementStatFields = withForm({
  defaultValues: weaponRefinementStatFormDefaults,
  props: {} as {
    /** Disables every control while a mutation is in flight. */
    isPending?: boolean
    /** False while editing a single stat. */
    allowAdd?: boolean
  },
  render: function Render({ form, isPending, allowAdd = true }) {
    return (
      <form.AppField name="stats" mode="array">
        {(field) => (
          <div className="space-y-4">
            {field.state.value.map((_, index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-input p-4"
              >
                <form.AppField
                  name={`stats[${index}].statName`}
                  validators={{
                    onSubmit: weaponRefinementStatRowInput.shape.statName,
                  }}
                >
                  {(statField) => (
                    <statField.SelectField
                      label="Seleccionar estadística"
                      options={WEAPON_REFINEMENT_STAT_OPTIONS}
                      placeholder="Seleccionar estadística"
                      disabled={isPending}
                    />
                  )}
                </form.AppField>

                <form.AppField
                  name={`stats[${index}].value`}
                  validators={{
                    onSubmit: weaponRefinementStatRowInput.shape.value,
                  }}
                >
                  {(statField) => (
                    <statField.NumberField
                      label="Valor"
                      placeholder="20"
                      min={0}
                      step="any"
                      disabled={isPending}
                    />
                  )}
                </form.AppField>

                <Show when={allowAdd && field.state.value.length > 1}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => field.removeValue(index)}
                  >
                    <HugeiconsIcon icon={DeleteIcon} />
                    Eliminar estadística
                  </Button>
                </Show>
              </div>
            ))}

            <Show when={allowAdd}>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => field.pushValue({ statName: "", value: 0 })}
              >
                Agregar estadística adicional
              </Button>
            </Show>
          </div>
        )}
      </form.AppField>
    )
  },
})
