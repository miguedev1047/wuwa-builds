import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@/modules/panel/admin/game-data/application/id"
import { sonataInput } from "@/modules/panel/admin/game-data/application/schemas"
import { toSonataEffectDraft } from "@/modules/panel/admin/game-data/application/echoes/sonatas"
import { readSonataSets } from "@/modules/encore/application/read-catalogs.server"
import { sonataSets, sonataSetEffects } from "@/db/schema"

export const getSonatas = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.query.sonataSets.findMany({
      orderBy: { id: "asc" },
      with: { effects: { orderBy: { sortOrder: "asc" } } },
    })
  })

/** Creates a hand-written set. Encore sets come from `syncSonatas`. */
export const createSonata = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(sonataInput)
  .handler(async ({ data }) => {
    const existing = await db.query.sonataSets.findFirst({
      where: { id: data.id },
      columns: { id: true },
    })

    if (existing) {
      throw new Error("Ya existe un set de sonata con ese ID")
    }

    await db.insert(sonataSets).values({
      id: data.id,
      name: data.name,
      icon: data.icon,
      color: data.color,
      source: "manual",
    })
    await db.insert(sonataSetEffects).values(
      data.effects.map((effect, index) => ({
        setId: data.id,
        sortOrder: index,
        ...effect,
      }))
    )

    return data.id
  })

export const updateSonata = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(sonataInput)
  .handler(async ({ data }) => {
    const existing = await db.query.sonataSets.findFirst({
      where: { id: data.id },
      columns: { id: true },
    })

    if (!existing) {
      throw new Error("Set de sonata no encontrado")
    }

    await db
      .update(sonataSets)
      .set({ name: data.name, icon: data.icon, color: data.color })
      .where(eq(sonataSets.id, data.id))

    await db.delete(sonataSetEffects).where(eq(sonataSetEffects.setId, data.id))
    await db.insert(sonataSetEffects).values(
      data.effects.map((effect, index) => ({
        setId: data.id,
        sortOrder: index,
        ...effect,
      }))
    )

    return data.id
  })

export const deleteSonata = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(sonataSets)
      .where(eq(sonataSets.id, data.id))
      .returning({ id: sonataSets.id })

    if (deleted.length === 0) {
      throw new Error("Set de sonata no encontrado")
    }

    return deleted[0].id
  })

/**
 * Imports the sets Encore knows about and parses their static bonuses.
 *
 * `manual` sets are never touched, so a hand-written set survives every sync.
 * Re-syncing an `encore` set replaces its effects, which is how a balance patch
 * reaches the panel.
 */
export const syncSonatas = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async () => {
    const sets = await readSonataSets()
    const current = await db.query.sonataSets.findMany({
      with: { effects: true },
    })
    const byId = new Map(current.map((set) => [set.id, set]))

    let created = 0
    let updated = 0
    let skipped = 0

    for (const set of sets) {
      if (byId.get(set.id)?.source === "manual") {
        skipped += 1
        continue
      }

      if (byId.has(set.id)) {
        await db
          .update(sonataSets)
          .set({ name: set.name, icon: set.icon, color: set.color })
          .where(eq(sonataSets.id, set.id))
        updated += 1
      } else {
        await db.insert(sonataSets).values({
          id: set.id,
          name: set.name,
          icon: set.icon,
          color: set.color,
          source: "encore",
        })
        created += 1
      }

      await db
        .delete(sonataSetEffects)
        .where(eq(sonataSetEffects.setId, set.id))

      if (set.effects.length > 0) {
        await db.insert(sonataSetEffects).values(
          set.effects.map((effect, index) => ({
            setId: set.id,
            sortOrder: index,
            ...toSonataEffectDraft(effect),
          }))
        )
      }
    }

    return { total: sets.length, created, updated, skipped }
  })
