import { z } from "zod"
import { isGrowthValue } from "@/modules/panel/admin/game-data/application/resonators/property-growth"

/** Fields the admin panel sends when adding a property growth entry. */
export const resonatorPropertyGrowthInput = z.object({
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
    .refine(isGrowthValue, "Usa un numero o un porcentaje (5%)"),
})

export type ResonatorPropertyGrowthInput = z.infer<
  typeof resonatorPropertyGrowthInput
>

/** Bulk create payload for the growth add dialog. */
export const resonatorPropertyGrowthInputs = z
  .array(resonatorPropertyGrowthInput)
  .min(1, "Selecciona al menos un nivel")
  .max(10, "Maximo 10 niveles")
