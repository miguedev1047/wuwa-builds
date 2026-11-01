import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { resonatorPropertyGrowth } from "@/db/schema"
import { growthValueColumns } from "@/modules/panel/admin/game-data/application/property-growth"
import {
  idInput,
  resonatorPropertyGrowthInput,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createResonatorPropertyGrowth = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(resonatorPropertyGrowthInput)
  .handler(async ({ data }) => {
    const { value, ...values } = data

    const [growth] = await db
      .insert(resonatorPropertyGrowth)
      .values({ ...values, ...growthValueColumns(value) })
      .returning()

    return growth
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
