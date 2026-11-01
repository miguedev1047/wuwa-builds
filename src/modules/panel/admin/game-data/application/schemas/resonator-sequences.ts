import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonatorSequences } from "@/db/schema"
import { idInput } from "./resonators"

/** Fields the admin panel can set for a resonator sequence. */
export const resonatorSequenceInput = createInsertSchema(resonatorSequences, {
  sequenceId: (schema) => schema.min(1, "El ID de la secuencia es requerido"),
  sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
  index: (schema) =>
    schema
      .min(1, "La secuencia minima es 1")
      .max(6, "La secuencia maxima es 6"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(120, "Maximo 120 caracteres"),
  description: (schema) => schema.trim().max(20000, "Maximo 20000 caracteres"),
}).omit({ id: true, createdAt: true, updatedAt: true })

export type ResonatorSequenceInput = z.infer<typeof resonatorSequenceInput>

export const resonatorSequenceUpdateInput = resonatorSequenceInput.extend({
  id: idInput.shape.id,
})

export type ResonatorSequenceUpdateInput = z.infer<
  typeof resonatorSequenceUpdateInput
>
