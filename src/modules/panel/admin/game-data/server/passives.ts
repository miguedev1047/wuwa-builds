import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { resonatorPassives } from "@/db/schema"
import {
  idInput,
  resonatorPassiveInput,
  resonatorPassiveUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createResonatorPassive = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorPassiveInput)
  .handler(async ({ data }) => {
    const [passive] = await db
      .insert(resonatorPassives)
      .values(data)
      .returning()

    return passive
  })

export const updateResonatorPassive = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorPassiveUpdateInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [passive] = await db
      .update(resonatorPassives)
      .set(values)
      .where(eq(resonatorPassives.id, id))
      .returning()

    if (!passive) {
      throw new Error("Pasiva no encontrada")
    }

    return passive
  })

export const deleteResonatorPassive = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(resonatorPassives)
      .where(eq(resonatorPassives.id, data.id))
      .returning({ id: resonatorPassives.id })

    if (deleted.length === 0) {
      throw new Error("Pasiva no encontrada")
    }

    return deleted[0].id
  })
