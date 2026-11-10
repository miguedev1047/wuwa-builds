import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { idInput } from "@game-data/application/id"
import {
  echoSkillBonusInput,
  echoSkillBonusUpdateInput,
  echoSkillInput,
} from "@game-data/application/schemas"
import { echoSkillBonuses, echoSkills } from "@db/schema"

/**
 * Creates or replaces the echo skill text.
 *
 * The admin imports it from Encore on the detail screen and may edit it after,
 * so the same call covers both cases.
 */
export const upsertEchoSkill = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(echoSkillInput)
  .handler(async ({ data }) => {
    const existing = await db.query.echoSkills.findFirst({
      where: { echoId: data.echoId },
      columns: { echoId: true },
    })

    if (existing) {
      await db
        .update(echoSkills)
        .set({
          description: data.description,
          simpleDescription: data.simpleDescription,
          icon: data.icon,
        })
        .where(eq(echoSkills.echoId, data.echoId))
    } else {
      await db.insert(echoSkills).values(data)
    }

    return data.echoId
  })

export const createEchoSkillBonus = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(echoSkillBonusInput)
  .handler(async ({ data }) => {
    const last = await db.query.echoSkillBonuses.findFirst({
      where: { echoId: data.echoId },
      columns: { sortOrder: true },
      orderBy: { sortOrder: "desc" },
    })

    const [bonus] = await db
      .insert(echoSkillBonuses)
      .values({
        ...data,
        conditionValue: data.conditionValue || null,
        sortOrder: last ? last.sortOrder + 1 : 0,
      })
      .returning()

    return bonus
  })

export const updateEchoSkillBonus = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(echoSkillBonusUpdateInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [bonus] = await db
      .update(echoSkillBonuses)
      .set({ ...values, conditionValue: values.conditionValue || null })
      .where(eq(echoSkillBonuses.id, id))
      .returning()

    if (!bonus) {
      throw new Error("Bono de habilidad no encontrado")
    }

    return bonus
  })

export const deleteEchoSkillBonus = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(echoSkillBonuses)
      .where(eq(echoSkillBonuses.id, data.id))
      .returning({ id: echoSkillBonuses.id })

    if (deleted.length === 0) {
      throw new Error("Bono de habilidad no encontrado")
    }

    return deleted[0].id
  })
