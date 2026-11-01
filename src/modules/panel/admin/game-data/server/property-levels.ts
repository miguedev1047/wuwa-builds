import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { resonatorPropertyLevelsSchema } from "@/modules/panel/admin/game-data/application/schemas/property-levels"
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
