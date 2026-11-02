import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { adminMiddleware } from "@/functions/middlewares"
import {
  idInput,
  weaponInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { weaponTypeName } from "@/modules/panel/admin/game-data/application/weapon-types"
import { weapons } from "@/db/schema"

export const getWeapons = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.query.weapons.findMany({ orderBy: { id: "asc" } })
  })

export const getWeapon = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    return await db.query.weapons.findFirst({
      where: {
        id: data.id,
      },
    })
  })

/**
 * Creates a weapon row from the admin form.
 *
 * `type_name` is derived from the numeric `type` instead of trusting the
 * client, so the two columns always describe the same weapon type.
 */
export const createWeapon = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponInput)
  .handler(async ({ data }) => {
    const existing = await db.query.weapons.findFirst({
      where: { id: data.id },
      columns: { id: true },
    })

    if (existing) {
      throw new Error("Ya existe un arma con ese ID")
    }

    const [weapon] = await db
      .insert(weapons)
      .values({ ...data, typeName: weaponTypeName(data.type) })
      .returning()

    return weapon
  })
