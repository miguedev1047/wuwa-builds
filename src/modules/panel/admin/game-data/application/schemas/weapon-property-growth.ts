import { z } from "zod"
import { isWeaponGrowthValue } from "@/modules/panel/admin/game-data/application/weapon-property-growth"

/** Fields the admin panel sends when adding a weapon property level. */
export const weaponPropertyGrowthInput = z.object({
  propertyId: z.number().int().positive(),
  sortOrder: z.number().int().positive(),
  level: z
    .number()
    .int()
    .min(1, "El nivel minimo es 1")
    .max(90, "El nivel maximo es 90"),
  value: z
    .string()
    .trim()
    .min(1, "El valor es requerido")
    .refine(isWeaponGrowthValue, "Usa un numero o un porcentaje (5%)"),
})

export type WeaponPropertyGrowthInput = z.infer<
  typeof weaponPropertyGrowthInput
>

/** Bulk create payload for the growth add dialog. */
export const weaponPropertyGrowthInputs = z
  .array(weaponPropertyGrowthInput)
  .min(1, "Selecciona al menos un nivel")
  .max(10, "Maximo 10 niveles")
