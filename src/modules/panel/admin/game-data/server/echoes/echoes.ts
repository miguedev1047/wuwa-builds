import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@/modules/panel/admin/game-data/application/id"
import { echoInput } from "@/modules/panel/admin/game-data/application/schemas"
import { echoes } from "@/db/schema"

export const getEchoes = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.query.echoes.findMany({ orderBy: { id: "asc" } })
  })

export const getEcho = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    return await db.query.echoes.findFirst({
      where: {
        id: data.id,
      },
    })
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
