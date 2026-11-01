import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonatorSkills } from "@/db/schema"
import { idInput } from "./resonators"

/** Fields the admin panel can set for a resonator skill. */
export const resonatorSkillInput = createInsertSchema(resonatorSkills, {
  skillId: (schema) => schema.min(1, "El ID de la habilidad es requerido"),
  sortOrder: (schema) => schema.min(1, "El indice del orden es requerido"),
  type: (schema) =>
    schema
      .trim()
      .min(1, "El tipo es obligatorio")
      .max(80, "Maximo 80 caracteres"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(120, "Maximo 120 caracteres"),
  description: (schema) => schema.trim().max(20000, "Maximo 20000 caracteres"),
  icon: (schema) => schema.trim(),
  media: (schema) => schema.trim(),
}).omit({ id: true, createdAt: true, updatedAt: true })

export type ResonatorSkillInput = z.infer<typeof resonatorSkillInput>

export const resonatorSkillUpdateInput = resonatorSkillInput.extend({
  id: idInput.shape.id,
})

export type ResonatorSkillUpdateInput = z.infer<
  typeof resonatorSkillUpdateInput
>

/** Form schema shared by the create and edit dialogs (`id` 0 means create). */
export const resonatorSkillFormInput = resonatorSkillUpdateInput.extend({
  id: z.number().int().min(0),
})
