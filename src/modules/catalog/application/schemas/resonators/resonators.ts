import {
  elementSchema,
  weaponTypeSchema,
  raritySchema,
} from "@/modules/game-data/domain/categories"
import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonators } from "@db/schema"

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
  rarity: raritySchema,
  introduction: (schema) => schema.trim().max(2000, "Maximo 2000 caracteres"),
  element: elementSchema,
  weaponType: weaponTypeSchema,
  icon: (schema) => schema.trim(),
}).omit({ createdAt: true, updatedAt: true })

export type ResonatorInput = z.infer<typeof resonatorInput>

/** Form drafts may show an empty select; submission still requires canonical ids. */
export const resonatorFormInput = resonatorInput.extend({
  element: z.union([elementSchema, z.literal("")]).pipe(elementSchema),
  weaponType: z.union([weaponTypeSchema, z.literal("")]).pipe(weaponTypeSchema),
})
export type ResonatorFormValues = z.input<typeof resonatorFormInput>
