import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { CATALOG_NOT_FOUND } from "@catalog/domain/catalog-error"
import { eq } from "drizzle-orm"
import { adminMiddleware, authMiddleware } from "@/functions/middlewares"
import { idInput, idsInput } from "@catalog/application/id"
import { echoInput } from "@catalog/application/schemas"
import type { EchoDetail } from "@catalog/domain/echo"
import { echoes } from "@db/schema"

export const getEchoes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return await db.query.echoes.findMany({ orderBy: { id: "asc" } })
  })

/** Bulk detail read for the five equipped echoes. */
export const getEchoesDetailed = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([authMiddleware])
  .validator(idsInput)
  .handler(async ({ data }): Promise<EchoDetail[]> => {
    return await db.query.echoes.findMany({
      where: { id: { in: data.ids } },
      with: {
        sets: {
          orderBy: { sortOrder: "asc" },
          with: { sonataEffects: true },
        },
        skill: true,
        skillBonuses: { orderBy: { sortOrder: "asc" } },
      },
    })
  })

export const getEcho = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([authMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const echo = await db.query.echoes.findFirst({
      where: {
        id: data.id,
      },
      with: {
        sets: {
          orderBy: { sortOrder: "asc" },
          with: { sonataEffects: true },
        },
        skill: true,
        skillBonuses: { orderBy: { sortOrder: "asc" } },
      },
    })

    if (!echo) {
      throw new Error(CATALOG_NOT_FOUND)
    }

    return echo
  })

/** Creates an echo row from the admin form. */
export const createEcho = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(echoInput)
  .handler(async ({ data }) => {
    const existing = await db.query.echoes.findFirst({
      where: { id: data.id },
      columns: { id: true },
    })

    if (existing) {
      throw new Error("Ya existe un eco con ese ID")
    }

    const [echo] = await db.insert(echoes).values(data).returning()

    return echo
  })

export const updateEcho = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(echoInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [echo] = await db
      .update(echoes)
      .set(values)
      .where(eq(echoes.id, id))
      .returning()

    if (!echo) {
      throw new Error("Eco no encontrado")
    }

    return echo
  })

export const deleteEcho = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(echoes)
      .where(eq(echoes.id, data.id))
      .returning({ id: echoes.id })

    if (deleted.length === 0) {
      throw new Error("Eco no encontrado")
    }

    return deleted[0].id
  })
