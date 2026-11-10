import { z } from "zod"
import { STAT_IDS } from "@game-data/application/stats/stats"

/** Canonical builder key of a sonata bonus. */
export const sonataStatId = z.enum(STAT_IDS)

const sonataEffectFields = z.object({
  pieces: z
    .number()
    .int()
    .min(1, "El minimo es 1 pieza")
    .max(5, "El maximo es 5 piezas"),
  description: z.string().trim().max(600, "Maximo 600 caracteres"),
  isConditional: z.boolean(),
  statId: sonataStatId.nullable(),
  value: z
    .number()
    .min(0, "El valor no puede ser negativo")
    .max(1000)
    .nullable(),
})

/** A static effect needs a stat and a value; a conditional one needs neither. */
function isValidEffect(effect: {
  isConditional: boolean
  statId: string | null
  value: number | null
}) {
  return effect.isConditional
    ? effect.statId === null && effect.value === null
    : effect.statId !== null && effect.value !== null
}

/** One piece threshold of a sonata set. */
export const sonataEffectInput = sonataEffectFields
  .extend({
    description: z
      .string()
      .trim()
      .min(1, "La descripcion es obligatoria")
      .max(600, "Maximo 600 caracteres"),
  })
  .refine(isValidEffect, {
    message:
      "Un efecto estatico necesita stat y valor; uno condicional no lleva ninguno",
  })

/** Set plus its effects, as the create and update server functions take it. */
export const sonataInput = z.object({
  id: z.number().int().min(1, "El ID es requerido"),
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(120, "Maximo 120 caracteres"),
  icon: z.string().trim(),
  color: z.string().trim().max(16),
  effects: z
    .array(sonataEffectInput)
    .min(1, "Agrega al menos un efecto")
    .max(2, "Maximo 2 efectos"),
})

/**
 * Form values: the dialog always renders two effect slots and the second one
 * may stay empty, so it is dropped before it reaches the server schema.
 */
export const sonataFormInput = z
  .object({
    id: z.number().int().min(1, "El ID es requerido"),
    name: z
      .string()
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(120, "Maximo 120 caracteres"),
    icon: z.string().trim(),
    color: z.string().trim().max(16),
    effects: z.array(sonataEffectFields).length(2, "Se esperan dos efectos"),
  })
  .refine(
    (values) =>
      values.effects.every(
        (effect) =>
          effect.description.trim() === "" ||
          effect.isConditional ||
          (effect.statId !== null && effect.value !== null)
      ),
    {
      message: "Un efecto estatico necesita stat y valor",
    }
  )

export type SonataEffectInput = z.infer<typeof sonataEffectInput>
export type SonataInput = z.infer<typeof sonataInput>
export type SonataFormInput = z.infer<typeof sonataFormInput>
