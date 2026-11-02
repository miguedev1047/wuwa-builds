import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { idInput } from "@/modules/panel/admin/game-data/application/id"
import { resonatorPropertyLevelsSchema } from "@/modules/panel/admin/game-data/application/schemas"
import { db } from "@/db"
import { resonatorPropertyLevels } from "@/db/schema"

export const createResonatorPropertyLevels = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(resonatorPropertyLevelsSchema)
  .handler(async ({ data }) => {
    const [resonator] = await db
      .insert(resonatorPropertyLevels)
      .values(data)
      .returning()

    return resonator
  })

export const deleteResonatorPropertyLevel = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(resonatorPropertyLevels)
      .where(eq(resonatorPropertyLevels.id, data.id))
      .returning({ id: resonatorPropertyLevels.id })

    if (deleted.length === 0) {
      throw new Error("Propiedad no encontrada")
    }

    return deleted[0].id
  })
