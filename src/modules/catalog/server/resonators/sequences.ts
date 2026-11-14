import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { resonatorSequences } from "@db/schema"
import { idInput } from "@catalog/application/id"
import {
  resonatorSequencesInput,
  resonatorSequenceUpdateInput,
} from "@catalog/application/schemas"
import { readCharacter } from "@encore/application/read-characters.server"

export const createResonatorSequences = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorSequencesInput)
  .handler(async ({ data }) => {
    return await db.insert(resonatorSequences).values(data).returning()
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

/**
 * Backfills the icons of the saved sequences from Encore.
 *
 * Rows added before the `icon` column existed have an empty icon. Only that
 * column is written, so edited names and descriptions survive the sync.
 */
export const syncResonatorSequenceIcons = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const character = await readCharacter(data.id)
    const icons = new Map(
      character.sequences.map((sequence) => [sequence.id, sequence.icon])
    )
    const saved = await db.query.resonatorSequences.findMany({
      where: { resonatorId: data.id },
    })
    const pending = saved.filter((sequence) => {
      const icon = icons.get(sequence.sequenceId)

      return Boolean(icon) && icon !== sequence.icon
    })

    for (const sequence of pending) {
      await db
        .update(resonatorSequences)
        .set({ icon: icons.get(sequence.sequenceId) ?? "" })
        .where(eq(resonatorSequences.id, sequence.id))
    }

    return { updated: pending.length }
  })
