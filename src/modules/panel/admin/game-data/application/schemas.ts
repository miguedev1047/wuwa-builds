import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonators } from "@/db/schema"

export const idInput = z.object({
  id: z.number().int().positive(),
})

export type IdInput = z.infer<typeof idInput>

/**
 * Fields the admin panel can set when creating a resonator.
 *
 * Derived from the Drizzle table (`drizzle-orm/zod`) so the column types stay
 * in sync: `id` and the timestamps are database-owned, while the free-text
 * columns get explicit limits the table itself cannot express.
 */
export const resonatorInput = createInsertSchema(resonators, {
  id: (schema) => schema.min(1, "El ID es requerido"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(80, "Maximo 80 caracteres"),
  card: (schema) => schema.trim(),
  portrait: (schema) => schema.trim(),
  circle: (schema) => schema.trim(),
  iconLarge: (schema) => schema.trim(),
  rarity: (schema) =>
    schema.min(1, "La rareza minima es 1").max(5, "La rareza maxima es 5"),
  introduction: (schema) => schema.trim().max(2000, "Maximo 2000 caracteres"),
  element: (schema) => schema.trim().min(1, "Selecciona un elemento"),
  weaponType: (schema) => schema.trim().min(1, "Selecciona un tipo de arma"),
  icon: (schema) => schema.trim(),
}).omit({ createdAt: true, updatedAt: true })

export type ResonatorInput = z.infer<typeof resonatorInput>

/** Tags of a resonator, as stored in `resonator_tags`. */
export const resonatorTagInput = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  description: z.string().trim().max(200),
  color: z.string().trim(),
  icon: z.string().trim(),
})

/** Replaces the whole tag list of a resonator. */
export const resonatorTagsInput = z.object({
  resonatorId: z.number().int().positive(),
  tags: z.array(resonatorTagInput).max(8, "Maximo 8 etiquetas"),
})

/** Tag names selected in the tags form. */
export const resonatorTagsSelectionInput = z.object({
  tags: z.array(z.string().trim().min(1)).max(8, "Maximo 8 etiquetas"),
})

export type ResonatorTagInput = z.infer<typeof resonatorTagInput>
