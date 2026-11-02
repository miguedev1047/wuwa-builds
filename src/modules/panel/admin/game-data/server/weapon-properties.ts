import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { weaponProperties } from "@/db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import {
  idInput,
  weaponPropertyInput,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createWeaponProperty = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(weaponPropertyInput)
  .handler(async ({ data }) => {
    const [property] = await db
      .insert(weaponProperties)
      .values(data)
      .returning()

    return property
  })

export const deleteWeaponProperty = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(weaponProperties)
      .where(eq(weaponProperties.id, data.id))
      .returning({ id: weaponProperties.id })

    if (deleted.length === 0) {
      throw new Error("Propiedad no encontrada")
    }

    return deleted[0].id
  })
