import { z } from "zod"

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
