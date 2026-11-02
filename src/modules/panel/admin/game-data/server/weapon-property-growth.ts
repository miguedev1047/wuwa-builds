import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { weaponPropertyGrowth } from "@/db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { weaponGrowthValueColumns } from "@/modules/panel/admin/game-data/application/weapon-property-growth"
import {
  idInput,
  weaponPropertyGrowthInputs,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createWeaponPropertyGrowth = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(weaponPropertyGrowthInputs)
  .handler(async ({ data }) => {
    const rows = data.map(({ value, ...values }) => ({
      ...values,
      ...weaponGrowthValueColumns(value),
    }))

    return await db.insert(weaponPropertyGrowth).values(rows).returning()
  })

export const deleteWeaponPropertyGrowth = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(weaponPropertyGrowth)
      .where(eq(weaponPropertyGrowth.id, data.id))
      .returning({ id: weaponPropertyGrowth.id })

    if (deleted.length === 0) {
      throw new Error("Nivel no encontrado")
    }

    return deleted[0].id
  })
