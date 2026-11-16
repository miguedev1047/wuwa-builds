import {
  weaponTypeSchema,
  raritySchema,
} from "@/modules/game-data/domain/categories"
import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { weapons } from "@db/schema"

/**
 * Fields the admin panel can set when creating a weapon.
 *
 * Derived from the Drizzle table (`drizzle-orm/zod`) so the column types stay
 * in sync. Weapon categories use the same stable ids as resonators.
 */
export const weaponInput = createInsertSchema(weapons, {
  id: (schema) => schema.int().min(1, "El ID es requerido"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(80, "Maximo 80 caracteres"),
  rarity: raritySchema,
  type: weaponTypeSchema,
  icon: (schema) => schema.trim(),
  description: (schema) => schema.trim().max(2000, "Maximo 2000 caracteres"),
})
  .omit({ createdAt: true, updatedAt: true })
  .required()

export type WeaponInput = z.infer<typeof weaponInput>
