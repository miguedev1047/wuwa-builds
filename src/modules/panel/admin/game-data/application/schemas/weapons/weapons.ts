import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { weapons } from "@/db/schema"

/**
 * Fields the admin panel can set when creating a weapon.
 *
 * Derived from the Drizzle table (`drizzle-orm/zod`) so the column types stay
 * in sync. `type_name` is not accepted from the client: the server derives it
 * from `type` with `weaponTypeName`, so both columns can never disagree.
 */
export const weaponInput = createInsertSchema(weapons, {
  id: (schema) => schema.int().min(1, "El ID es requerido"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(80, "Maximo 80 caracteres"),
  rarity: (schema) =>
    schema
      .int()
      .min(1, "La rareza minima es 1")
      .max(5, "La rareza maxima es 5"),
  type: (schema) =>
    schema
      .int()
      .min(1, "Selecciona un tipo de arma")
      .max(5, "Tipo de arma invalido"),
  icon: (schema) => schema.trim(),
  description: (schema) => schema.trim().max(2000, "Maximo 2000 caracteres"),
})
  .omit({ typeName: true, createdAt: true, updatedAt: true })
  .required()

export type WeaponInput = z.infer<typeof weaponInput>
