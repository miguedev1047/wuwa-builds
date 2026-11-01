import { resonatorPropertyLevels } from "@/db/schema"
import { createInsertSchema } from "drizzle-orm/zod"
import type z from "zod"

export const resonatorPropertyLevelsSchema = createInsertSchema(
  resonatorPropertyLevels,
  {
    baseValue: (schema) => schema.min(1, "El valor base es requerido."),
    icon: (schema) => schema.min(1, "El icono es requerido"),
    name: (schema) => schema.min(1, "El nombre es requerido"),
    resonatorId: (schema) => schema.min(1, "El ID del resonador es requerido"),
    sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
  }
).omit({ id: true, createdAt: true, updatedAt: true })

export type ResonatorPropertyLevelInput = z.infer<
  typeof resonatorPropertyLevelsSchema
>
