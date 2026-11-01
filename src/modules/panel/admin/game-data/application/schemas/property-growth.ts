import { z } from "zod"
import { isGrowthValue } from "@/modules/panel/admin/game-data/application/property-growth"

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
