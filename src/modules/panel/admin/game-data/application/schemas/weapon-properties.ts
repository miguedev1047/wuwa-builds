import { createInsertSchema } from "drizzle-orm/zod"
import type z from "zod"
import { weaponProperties } from "@/db/schema"

/** Fields the admin panel sends when adding a weapon property. */
export const weaponPropertyInput = createInsertSchema(weaponProperties, {
  baseValue: (schema) => schema.min(0, "El valor base no puede ser negativo."),
  icon: (schema) => schema.min(1, "El icono es requerido"),
  name: (schema) => schema.min(1, "El nombre es requerido"),
  weaponId: (schema) => schema.min(1, "El ID del arma es requerido"),
  sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .required()

export type WeaponPropertyInput = z.infer<typeof weaponPropertyInput>
