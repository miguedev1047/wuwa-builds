import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { weaponRefinementStats } from "@db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@game-data/application/id"
import {
  weaponRefinementStatUpdateInput,
  weaponRefinementStatsInput,
} from "@game-data/application/schemas"

export const createWeaponRefinementStats = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponRefinementStatsInput)
  .handler(async ({ data }) => {
    return await db.insert(weaponRefinementStats).values(data).returning()
  })

export const updateWeaponRefinementStat = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponRefinementStatUpdateInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [stat] = await db
      .update(weaponRefinementStats)
      .set(values)
      .where(eq(weaponRefinementStats.id, id))
      .returning()

    if (!stat) {
      throw new Error("Estadistica no encontrada")
    }

    return stat
  })

export const deleteWeaponRefinementStat = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(weaponRefinementStats)
      .where(eq(weaponRefinementStats.id, data.id))
      .returning({ id: weaponRefinementStats.id })

    if (deleted.length === 0) {
      throw new Error("Estadistica no encontrada")
    }

    return deleted[0].id
  })
