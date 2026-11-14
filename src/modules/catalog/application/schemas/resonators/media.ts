import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonatorsMedia } from "@db/schema"
import { idInput } from "@catalog/application/id"

/** Fields the admin panel can set for a resonator image. */
export const resonatorMediaInput = createInsertSchema(resonatorsMedia, {
  kind: (schema) => schema.trim().min(1, "El tipo de imagen es requerido"),
  url: (schema) => schema.trim().max(2048, "Maximo 2048 caracteres"),
  sortOrder: (schema) => schema.min(0, "El indice del orden es invalido"),
}).omit({ id: true, createdAt: true, updatedAt: true })

export type ResonatorMediaInput = z.infer<typeof resonatorMediaInput>

/** Edit payload: the images section only changes the URL. */
export const resonatorMediaUpdateInput = z.object({
  id: idInput.shape.id,
  url: z.string().trim().max(2048, "Maximo 2048 caracteres"),
})

export type ResonatorMediaUpdateInput = z.infer<
  typeof resonatorMediaUpdateInput
>
