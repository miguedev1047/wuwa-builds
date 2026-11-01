import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { notFound } from "@tanstack/react-router"
import { eq } from "drizzle-orm"
import {
  idInput,
  resonatorInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { adminMiddleware } from "@/functions/middlewares"
import { resonators } from "@/db/schema"

export const getCharacters = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.query.resonators.findMany()
  })

/**
 * Single query of the resonator detail screen: the row plus every relation the
 * panel can edit, so sections do not need their own `wuwa-builds` queries.
 */
export const getCharacter = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const resonator = await db.query.resonators.findFirst({
      where: { id: data.id },
      with: {
        tags: { orderBy: { sortOrder: "asc" } },
        properties: {
          orderBy: { sortOrder: "asc" },
          with: { growth: { orderBy: { sortOrder: "asc" } } },
        },
        skills: { orderBy: { sortOrder: "asc" } },
        sequences: { orderBy: { sortOrder: "asc" } },
        passives: {
          orderBy: { sortOrder: "asc" },
          with: { consume: { orderBy: { sortOrder: "asc" } } },
        },
        breaches: { orderBy: { sortOrder: "asc" } },
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
