import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { resonatorPropertyGrowth } from "@/db/schema"
import { growthValueColumns } from "@/modules/game-data/application/resonators/property-growth"
import { idInput } from "@/modules/game-data/application/id"
import { resonatorPropertyGrowthInputs } from "@/modules/game-data/application/schemas"

export const createResonatorPropertyGrowth = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(resonatorPropertyGrowthInputs)
  .handler(async ({ data }) => {
    const rows = data.map(({ value, ...values }) => ({
      ...values,
      ...growthValueColumns(value),
    }))

    return await db.insert(resonatorPropertyGrowth).values(rows).returning()
  })

export const deleteResonatorPropertyGrowth = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(resonatorPropertyGrowth)
      .where(eq(resonatorPropertyGrowth.id, data.id))
      .returning({ id: resonatorPropertyGrowth.id })

    if (deleted.length === 0) {
      throw new Error("Nivel no encontrado")
    }

    return deleted[0].id
  })
