import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { echoes } from "@/db/schema"

/** Costs a single echo can occupy in a build. */
export const ECHO_COSTS = [1, 3, 4] as const

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
  class: (schema) =>
    schema.int().min(0, "Clase invalida").max(3, "Clase invalida"),
  cost: (schema) =>
    schema
      .int()
      .refine(
        (cost) => ECHO_COSTS.includes(cost as (typeof ECHO_COSTS)[number]),
        "El coste debe ser 1, 3 o 4"
      ),
  icon: (schema) => schema.trim(),
})
  .omit({ createdAt: true, updatedAt: true })
  .required()

export type EchoInput = z.infer<typeof echoInput>
