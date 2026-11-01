import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { resonatorSequences } from "@/db/schema"
import {
  idInput,
  resonatorSequenceInput,
  resonatorSequenceUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createResonatorSequence = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorSequenceInput)
  .handler(async ({ data }) => {
    const [sequence] = await db
      .insert(resonatorSequences)
      .values(data)
      .returning()

    return sequence
  })

export const updateResonatorSequence = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorSequenceUpdateInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [sequence] = await db
      .update(resonatorSequences)
      .set(values)
      .where(eq(resonatorSequences.id, id))
      .returning()

    if (!sequence) {
      throw new Error("Secuencia no encontrada")
    }

    return sequence
  })

export const deleteResonatorSequence = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(resonatorSequences)
      .where(eq(resonatorSequences.id, data.id))
      .returning({ id: resonatorSequences.id })

    if (deleted.length === 0) {
      throw new Error("Secuencia no encontrada")
    }

    return deleted[0].id
  })
