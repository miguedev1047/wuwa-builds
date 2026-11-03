import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@/modules/panel/admin/game-data/application/id"
import { echoSetInput } from "@/modules/panel/admin/game-data/application/schemas"
import { echoSets } from "@/db/schema"

/**
 * Links one of the echo's sonata sets.
 *
 * The name and the icon are copied from `sonata_sets` instead of trusting the
 * client, and the position is the end of the current list.
 */
export const createEchoSet = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(echoSetInput)
  .handler(async ({ data }) => {
    const sonata = await db.query.sonataSets.findFirst({
      where: { id: data.setId },
      columns: { id: true, name: true, icon: true },
    })

    if (!sonata) {
      throw new Error("Set de sonata no encontrado")
    }

    const existing = await db.query.echoSets.findFirst({
      where: { echoId: data.echoId, setId: data.setId },
      columns: { id: true },
    })

    if (existing) {
      throw new Error("El eco ya tiene ese set")
    }

    const last = await db.query.echoSets.findFirst({
      where: { echoId: data.echoId },
      columns: { sortOrder: true },
      orderBy: { sortOrder: "desc" },
    })

    const [echoSet] = await db
      .insert(echoSets)
      .values({
        echoId: data.echoId,
        setId: data.setId,
        name: sonata.name,
        icon: sonata.icon,
        sortOrder: last ? last.sortOrder + 1 : 0,
      })
      .returning()

    return echoSet
  })

export const deleteEchoSet = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(echoSets)
      .where(eq(echoSets.id, data.id))
      .returning({ id: echoSets.id })

    if (deleted.length === 0) {
      throw new Error("Set del eco no encontrado")
    }

    return deleted[0].id
  })
