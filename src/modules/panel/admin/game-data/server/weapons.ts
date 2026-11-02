import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { notFound } from "@tanstack/react-router"
import { eq } from "drizzle-orm"
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

/**
 * Single query of the weapon detail screen: the row plus the relations the
 * panel edits, so sections do not need their own `wuwa-builds` queries.
 */
export const getWeapon = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const weapon = await db.query.weapons.findFirst({
      where: { id: data.id },
      with: {
        properties: {
          orderBy: { sortOrder: "asc" },
          with: { growth: { orderBy: { sortOrder: "asc" } } },
        },
        refinements: {
          orderBy: { sortOrder: "asc" },
          with: { stats: { orderBy: { sortOrder: "asc" } } },
        },
      },
    })

    if (!weapon) {
      throw notFound()
    }

    return weapon
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

export const updateWeapon = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [weapon] = await db
      .update(weapons)
      .set({ ...values, typeName: weaponTypeName(values.type) })
      .where(eq(weapons.id, id))
      .returning()

    if (!weapon) {
      throw new Error("Arma no encontrada")
    }

    return weapon
  })

export const deleteWeapon = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(weapons)
      .where(eq(weapons.id, data.id))
      .returning({ id: weapons.id })

    if (deleted.length === 0) {
      throw new Error("Arma no encontrada")
    }

    return deleted[0].id
  })
