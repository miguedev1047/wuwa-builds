import {
  echoClassSchema,
  echoCostSchema,
} from "@/modules/game-data/domain/categories"
import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { echoes } from "@db/schema"

export { ECHO_COSTS } from "@/modules/game-data/domain/categories"

/**
 * Fields the admin panel can set when creating an echo.
 *
 * Derived from the Drizzle table (`drizzle-orm/zod`) so the column types stay
 * in sync. Sonata sets and the active skill are child tables edited from the
 * detail screen, so neither is accepted here.
 */
export const echoInput = createInsertSchema(echoes, {
  id: (schema) => schema.int().min(1, "El ID es requerido"),
  name: (schema) =>
    schema
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(80, "Maximo 80 caracteres"),
  class: echoClassSchema,
  cost: echoCostSchema,
  icon: (schema) => schema.trim(),
})
  .omit({ createdAt: true, updatedAt: true })
  .required()

export type EchoInput = z.infer<typeof echoInput>
