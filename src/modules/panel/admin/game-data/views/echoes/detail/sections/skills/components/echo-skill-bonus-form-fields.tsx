import { useEffect, useRef } from "react"
import { useSelector } from "@tanstack/react-form"
import { withForm } from "@/components/form"
import type { FormOption } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import {
  ECHO_SKILL_CONDITIONS,
  type EchoSkillConditionId,
} from "@/modules/panel/admin/game-data/application/echoes/skills"
import type { EchoSkillBonusFormInput } from "@/modules/panel/admin/game-data/application/schemas"
import { STAT_OPTIONS } from "@/modules/panel/admin/game-data/application/stats/stats"
import {
  RESONATOR_ELEMENTS,
  RESONATOR_WEAPON_TYPES,
} from "@/modules/panel/admin/game-data/views/resonators/shared/constants/resonator"

/** Empty bonus values; `statId` stays empty so the select shows its placeholder. */
export function echoSkillBonusFormDefaults(
  echoId: number
): EchoSkillBonusFormInput {
  return {
    id: 0,
    echoId,
    statId: "",
    value: 0,
    requiresMainSlot: false,
    condition: "none",
    conditionValue: null,
  }
}

/** Reusable fields of the echo skill bonus form. */
export const EchoSkillBonusFields = withForm({
  defaultValues: echoSkillBonusFormDefaults(0),
  props: {} as {
    isPending?: boolean
    /** Resonator options for the `resonator` condition. */
    characterOptions: FormOption[]
  },
  render: function Render({ form, isPending, characterOptions }) {
    const condition = useSelector(
      form.store,
      (state) => state.values.condition as EchoSkillConditionId
    )
    const previous = useRef(condition)

    useEffect(() => {
      if (previous.current === condition) return

      previous.current = condition
      form.setFieldValue("conditionValue", null)
    }, [condition, form])

    return (
      <FieldGroup className="gap-4">
        <form.AppField name="statId">
          {(field) => (
            <field.SelectField
              label="Estadística"
              options={STAT_OPTIONS}
              placeholder="Seleccionar estadística"
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField name="value">
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

        <form.AppField name="condition">
          {(field) => (
            <field.SelectField
              label="Condición"
              options={ECHO_SKILL_CONDITIONS}
              placeholder="Seleccionar condición"
              disabled={isPending}
            />
          )}
        </form.AppField>

        {condition === "resonator" ? (
          <form.AppField name="conditionValue">
            {(field) => (
              <field.ComboboxField
                label="Resonador"
                options={characterOptions}
                placeholder="Seleccionar resonador"
                disabled={isPending}
              />
            )}
          </form.AppField>
        ) : null}

        {condition === "element" ? (
          <form.AppField name="conditionValue">
            {(field) => (
              <field.SelectField
                label="Elemento"
                options={RESONATOR_ELEMENTS}
                placeholder="Seleccionar elemento"
                disabled={isPending}
              />
            )}
          </form.AppField>
        ) : null}

        {condition === "weaponType" ? (
          <form.AppField name="conditionValue">
            {(field) => (
              <field.SelectField
                label="Tipo de arma"
                options={RESONATOR_WEAPON_TYPES}
                placeholder="Seleccionar tipo de arma"
                disabled={isPending}
              />
            )}
          </form.AppField>
        ) : null}

        <form.AppField name="requiresMainSlot">
          {(field) => (
            <field.SwitchField
              label="Ranura principal"
              description="Solo aplica si el eco ocupa la ranura activa."
              disabled={isPending}
            />
          )}
        </form.AppField>
      </FieldGroup>
    )
  },
})
