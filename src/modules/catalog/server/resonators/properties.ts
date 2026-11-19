import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { idInput } from "@catalog/application/id"
import { resonatorPropertyLevelsInput } from "@catalog/application/schemas"
import { db } from "@/db"
import { resonatorPropertyLevels } from "@db/schema"

export const createResonatorPropertyLevels = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(resonatorPropertyLevelsInput)
  .handler(async ({ data }) => {
    return await db.insert(resonatorPropertyLevels).values(data).returning()
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
