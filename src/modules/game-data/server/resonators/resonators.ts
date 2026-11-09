import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { notFound } from "@tanstack/react-router"
import { eq } from "drizzle-orm"
import { idInput } from "@/modules/game-data/application/id"
import {
  resonatorInput,
  type ResonatorInput,
} from "@/modules/game-data/application/schemas"
import { adminMiddleware, authMiddleware } from "@/functions/middlewares"
import type { CharacterDetail } from "@/modules/game-data/domain/character"
import { resonators, resonatorsMedia } from "@/db/schema"
import { RESONATOR_MEDIA_KINDS } from "@/modules/game-data/application/constants/resonator"

type ResonatorImages = Pick<
  ResonatorInput,
  "id" | "icon" | "card" | "iconLarge" | "circle" | "portrait"
>

/**
 * `resonators_media` rows for the scalar image columns of a resonator.
 *
 * The panel edits media rows, but list queries and the builder still read the
 * mirrored columns on `resonators`, so both stores are written together.
 */
function resonatorMediaRows(resonator: ResonatorImages) {
  return RESONATOR_MEDIA_KINDS.map((kind, sortOrder) => ({
    resonatorId: resonator.id,
    kind,
    url: resonator[kind],
    sortOrder,
  }))
}

export const getCharacters = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return await db.query.resonators.findMany({ orderBy: { id: "asc" } })
  })

/**
 * Single query of the resonator detail screen: the row plus every relation the
 * panel can edit, so sections do not need their own `wuwa-builds` queries.
 */
export const getCharacter = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([authMiddleware])
  .validator(idInput)
  .handler(async ({ data }): Promise<CharacterDetail> => {
    const resonator = await db.query.resonators.findFirst({
      where: { id: data.id },
      with: {
        media: { orderBy: { sortOrder: "asc" } },
        tags: { orderBy: { sortOrder: "asc" } },
        properties: {
          orderBy: { sortOrder: "asc" },
          with: { growth: { orderBy: { sortOrder: "asc" } } },
        },
        skills: { orderBy: { sortOrder: "asc" } },
        sequences: { orderBy: { sortOrder: "asc" } },
        passives: { orderBy: { sortOrder: "asc" } },
      },
    })

    if (!resonator) {
      throw notFound()
    }
    return resonator
  })

export const createResonator = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorInput)
  .handler(async ({ data }) => {
    const [resonator] = await db.insert(resonators).values(data).returning()

    await db.insert(resonatorsMedia).values(resonatorMediaRows(resonator))

    return resonator
  })

export const updateResonator = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [resonator] = await db
      .update(resonators)
      .set(values)
      .where(eq(resonators.id, id))
      .returning()

    if (!resonator) {
      throw new Error("Resonador no encontrado")
    }

    for (const media of resonatorMediaRows(resonator)) {
      await db
        .insert(resonatorsMedia)
        .values(media)
        .onConflictDoUpdate({
          target: [resonatorsMedia.resonatorId, resonatorsMedia.kind],
          set: { url: media.url },
        })
    }

    return resonator
  })

export const deleteResonator = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(resonators)
      .where(eq(resonators.id, data.id))
      .returning({ id: resonators.id })

    if (deleted.length === 0) {
      throw new Error("Resonador no encontrado")
    }

    return deleted[0].id
  })
