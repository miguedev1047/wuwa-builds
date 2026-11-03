import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { echoSets } from "@/db/schema"

/**
 * Links a sonata set to an echo.
 *
 * `name` and `icon` are derived on the server from `sonata_sets`, and
 * `sortOrder` is the next position, so the client only picks the pair.
 */
export const echoSetInput = createInsertSchema(echoSets, {
  echoId: (schema) => schema.int().min(1, "El eco es requerido"),
  setId: (schema) => schema.int().min(1, "Selecciona un set"),
})
  .omit({
    id: true,
    sortOrder: true,
    name: true,
    icon: true,
    createdAt: true,
    updatedAt: true,
  })
  .required()

export type EchoSetInput = z.infer<typeof echoSetInput>
