import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonatorPassives } from "@/db/schema"
import { idInput } from "./resonators"

/** Fields the admin panel can set for a resonator passive. */
export const resonatorPassiveInput = createInsertSchema(resonatorPassives, {
  passiveId: (schema) => schema.min(1, "El ID de la pasiva es requerido"),
  sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
  title: (schema) =>
    schema
      .trim()
      .min(1, "El titulo es obligatorio")
      .max(120, "Maximo 120 caracteres"),
  icon: (schema) => schema.trim(),
}).omit({ id: true, createdAt: true, updatedAt: true })

export type ResonatorPassiveInput = z.infer<typeof resonatorPassiveInput>

/** Bulk create payload for the add dialog. */
export const resonatorPassivesInput = z
  .array(resonatorPassiveInput)
  .min(1, "Selecciona al menos una pasiva")
  .max(10, "Maximo 10 pasivas")

export const resonatorPassiveUpdateInput = resonatorPassiveInput.extend({
  id: idInput.shape.id,
})

export type ResonatorPassiveUpdateInput = z.infer<
  typeof resonatorPassiveUpdateInput
>
