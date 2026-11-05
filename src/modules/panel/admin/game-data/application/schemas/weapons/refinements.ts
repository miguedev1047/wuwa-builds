import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { weaponRefinementStats, weaponRefinements } from "@/db/schema"
import { isStatId } from "@/modules/panel/admin/game-data/application/stats/stats"
import { idInput } from "../../id"

/** Fields the admin panel sends when creating a weapon refinement. */
export const weaponRefinementInput = createInsertSchema(weaponRefinements, {
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(120, "Maximo 120 caracteres"),
  effect: (schema) => schema.trim().max(4000, "Maximo 4000 caracteres"),
  sortOrder: (schema) =>
    schema.int().min(1, "El rango minimo es 1").max(5, "El rango maximo es 5"),
  weaponId: (schema) => schema.min(1, "El ID del arma es requerido"),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .required()

export type WeaponRefinementInput = z.infer<typeof weaponRefinementInput>

export const weaponRefinementUpdateInput = weaponRefinementInput.extend({
  id: idInput.shape.id,
})

export type WeaponRefinementUpdateInput = z.infer<
  typeof weaponRefinementUpdateInput
>

/** Values of the add/edit refinement form; the id is 0 while creating. */
export const weaponRefinementFormInput = weaponRefinementUpdateInput.extend({
  id: z.number().int().nonnegative(),
})

/** Fields the admin panel sends when creating a refinement stat. */
export const weaponRefinementStatInput = createInsertSchema(
  weaponRefinementStats,
  {
    statName: (schema) =>
      schema
        .trim()
        .min(1, "Selecciona una estadistica")
        .refine(
          (value): boolean => value === "" || isStatId(value),
          "Estadistica invalida"
        ),
    statNumber: (schema) =>
      schema.refine(Number.isFinite, "El valor debe ser un numero"),
    refinementId: (schema) =>
      schema.min(1, "El ID del refinamiento es requerido"),
    sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
  }
)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .required()

export type WeaponRefinementStatInput = z.infer<
  typeof weaponRefinementStatInput
>

/** One stat row of the refinement dialog, before it is a payload. */
export const weaponRefinementStatRowInput = z.object({
  statName: weaponRefinementStatInput.shape.statName,
  value: weaponRefinementStatInput.shape.statNumber,
})

export type WeaponRefinementStatRowInput = z.infer<
  typeof weaponRefinementStatRowInput
>

/** Values of the add/edit stat dialog. */
export const weaponRefinementStatsFormInput = z.object({
  refinementId: z.number().int().positive(),
  sortOrder: z.number().int().positive(),
  stats: z
    .array(weaponRefinementStatRowInput)
    .min(1, "Agrega al menos una estadistica")
    .max(10, "Maximo 10 estadisticas"),
})

export type WeaponRefinementStatsFormValues = z.infer<
  typeof weaponRefinementStatsFormInput
>

export const weaponRefinementStatUpdateInput = weaponRefinementStatInput.extend(
  { id: idInput.shape.id }
)

export type WeaponRefinementStatUpdateInput = z.infer<
  typeof weaponRefinementStatUpdateInput
>

/** Bulk payload created from the stat dialog. */
export const weaponRefinementStatsInput = z
  .array(weaponRefinementStatInput)
  .min(1, "Agrega al menos una estadistica")
  .max(10, "Maximo 10 estadisticas")
