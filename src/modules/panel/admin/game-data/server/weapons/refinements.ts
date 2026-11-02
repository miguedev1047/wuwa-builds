import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { weaponRefinements } from "@/db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@/modules/panel/admin/game-data/application/id"
import {
  weaponRefinementInput,
  weaponRefinementUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createWeaponRefinement = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponRefinementInput)
  .handler(async ({ data }) => {
    const existing = await db.query.weaponRefinements.findFirst({
      where: { weaponId: data.weaponId, sortOrder: data.sortOrder },
      columns: { id: true },
    })

    if (existing) {
      throw new Error("Ya existe un refinamiento con ese rango")
    }

    const [refinement] = await db
      .insert(weaponRefinements)
      .values(data)
      .returning()

    return refinement
  })

export const updateWeaponRefinement = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponRefinementUpdateInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const existing = await db.query.weaponRefinements.findFirst({
      where: { weaponId: values.weaponId, sortOrder: values.sortOrder },
      columns: { id: true },
    })

    if (existing && existing.id !== id) {
      throw new Error("Ya existe un refinamiento con ese rango")
    }

    const [refinement] = await db
      .update(weaponRefinements)
      .set(values)
      .where(eq(weaponRefinements.id, id))
      .returning()

    if (!refinement) {
      throw new Error("Refinamiento no encontrado")
    }

    return refinement
  })

export const deleteWeaponRefinement = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(weaponRefinements)
      .where(eq(weaponRefinements.id, data.id))
      .returning({ id: weaponRefinements.id })

    if (deleted.length === 0) {
      throw new Error("Refinamiento no encontrado")
    }

    return deleted[0].id
  })
