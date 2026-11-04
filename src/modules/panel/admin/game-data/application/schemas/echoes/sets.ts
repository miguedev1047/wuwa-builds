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

/**
 * Form values of the add dialog.
 *
 * The select starts empty, so `setId` is nullable; the refinement keeps the
 * "Selecciona un set" error while letting the field render its placeholder
 * instead of a literal `0`.
 */
export const echoSetFormInput = z.object({
  echoId: z.number().int().min(1, "El eco es requerido"),
  setId: z
    .number()
    .int()
    .nullable()
    .refine((setId) => setId !== null && setId > 0, {
      message: "Selecciona un set",
    }),
})

export type EchoSetInput = z.infer<typeof echoSetInput>
export type EchoSetFormInput = z.infer<typeof echoSetFormInput>
