import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { and, eq, inArray } from "drizzle-orm"
import { weaponRefinements } from "@db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@catalog/application/id"
import {
  weaponRefinementsInput,
  weaponRefinementUpdateInput,
} from "@catalog/application/schemas"

export const createWeaponRefinements = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(weaponRefinementsInput)
  .handler(async ({ data }) => {
    const weaponId = data[0]?.weaponId

    if (weaponId === undefined) {
      throw new Error("El ID del arma es requerido")
    }

    if (data.some((refinement) => refinement.weaponId !== weaponId)) {
      throw new Error("Los refinamientos deben pertenecer al mismo arma")
    }

    const ranks = data.map((refinement) => refinement.sortOrder)

    if (new Set(ranks).size !== ranks.length) {
      throw new Error("Ya existe un refinamiento con ese rango")
    }

    const existing = await db
      .select({ sortOrder: weaponRefinements.sortOrder })
      .from(weaponRefinements)
      .where(
        and(
          eq(weaponRefinements.weaponId, weaponId),
          inArray(weaponRefinements.sortOrder, ranks)
        )
      )

    if (existing.length > 0) {
      throw new Error("Ya existe un refinamiento con ese rango")
    }

    return await db.insert(weaponRefinements).values(data).returning()
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
