import { resonatorPropertyLevels } from "@db/schema"
import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { isResonatorPropertyStatId } from "@catalog/application/constants/resonator"

export const resonatorPropertyLevelsSchema = createInsertSchema(
  resonatorPropertyLevels,
  {
    baseValue: (schema) =>
      schema.min(0, "El valor base no puede ser negativo."),
    icon: (schema) => schema.min(1, "El icono es requerido"),
    name: (schema) =>
      schema
        .trim()
        .min(1, "Selecciona una estadistica")
        .refine(
          (value): boolean => value === "" || isResonatorPropertyStatId(value),
          "Estadistica invalida"
        ),
    resonatorId: (schema) => schema.min(1, "El ID del resonador es requerido"),
    sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
  }
).omit({ id: true, createdAt: true, updatedAt: true })

export type ResonatorPropertyLevelInput = z.infer<
  typeof resonatorPropertyLevelsSchema
>

/** One or more property levels stored in a single request. */
export const resonatorPropertyLevelsInput = z
  .array(resonatorPropertyLevelsSchema)
  .min(1, "Agrega al menos una propiedad.")

export type ResonatorPropertyLevelsInput = z.infer<
  typeof resonatorPropertyLevelsInput
>
