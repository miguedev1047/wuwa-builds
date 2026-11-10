import { createInsertSchema } from "drizzle-orm/zod"
import type z from "zod"
import { weaponProperties } from "@db/schema"
import { isWeaponPropertyStatId } from "@game-data/application/constants/weapon"

/** Fields the admin panel sends when adding a weapon property. */
export const weaponPropertyInput = createInsertSchema(weaponProperties, {
  baseValue: (schema) => schema.min(0, "El valor base no puede ser negativo."),
  icon: (schema) => schema.min(1, "El icono es requerido"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "Selecciona una estadistica")
      .refine(
        (value): boolean => value === "" || isWeaponPropertyStatId(value),
        "Estadistica invalida"
      ),
  weaponId: (schema) => schema.min(1, "El ID del arma es requerido"),
  sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .required()

export type WeaponPropertyInput = z.infer<typeof weaponPropertyInput>
