import { z } from "zod"
import {
  ECHO_SKILL_CONDITION_IDS,
  type EchoSkillConditionId,
} from "@game-data/application/echoes/skills"
import { isStatId } from "@game-data/application/stats/stats"
import { idInput } from "@game-data/application/id"
import {
  isElementId,
  isWeaponTypeId,
} from "@game-data/application/constants/resonator"

/** Fields of the echo skill text block. */
export const echoSkillInput = z.object({
  echoId: z.number().int().min(1, "El eco es requerido"),
  description: z
    .string()
    .trim()
    .min(1, "La descripcion es obligatoria")
    .max(4000, "Maximo 4000 caracteres"),
  simpleDescription: z.string().trim().max(2000, "Maximo 2000 caracteres"),
  icon: z.string().trim(),
})

/** Whether `conditionValue` is coherent with the condition. */
function hasValidConditionValue(bonus: {
  condition: EchoSkillConditionId
  conditionValue: string | null
}): boolean {
  const value = bonus.conditionValue?.trim() ?? ""

  switch (bonus.condition) {
    case "none":
    case "combat":
      return value === ""
    case "resonator":
      return value.length > 0
    case "element":
      return isElementId(value)
    case "weaponType":
      return isWeaponTypeId(value)
  }
}

/** One stat bonus of the echo skill. */
export const echoSkillBonusInput = z
  .object({
    echoId: z.number().int().min(1, "El eco es requerido"),
    statId: z
      .string()
      .trim()
      .min(1, "Selecciona una estadistica")
      .refine((value): boolean => value === "" || isStatId(value), {
        message: "Estadistica invalida",
      }),
    value: z.number().min(0, "El valor no puede ser negativo").max(1000),
    requiresMainSlot: z.boolean(),
    condition: z.enum(ECHO_SKILL_CONDITION_IDS),
    conditionValue: z.string().trim().nullable(),
  })
  .refine(hasValidConditionValue, {
    message:
      "La condicion necesita un resonador, elemento o tipo de arma valido",
  })

export const echoSkillBonusUpdateInput = echoSkillBonusInput.safeExtend({
  id: idInput.shape.id,
})

/** Form values: the id is 0 while creating. */
export const echoSkillBonusFormInput = echoSkillBonusUpdateInput.safeExtend({
  id: z.number().int().nonnegative(),
})

export type EchoSkillInput = z.infer<typeof echoSkillInput>
export type EchoSkillBonusInput = z.infer<typeof echoSkillBonusInput>
export type EchoSkillBonusUpdateInput = z.infer<
  typeof echoSkillBonusUpdateInput
>
export type EchoSkillBonusFormInput = z.infer<typeof echoSkillBonusFormInput>
