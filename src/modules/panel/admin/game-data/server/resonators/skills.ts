import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { adminMiddleware } from "@/functions/middlewares"
import { resonatorSkills } from "@/db/schema"
import { idInput } from "@/modules/panel/admin/game-data/application/id"
import {
  resonatorSkillsInput,
  resonatorSkillUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"

export const createResonatorSkills = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorSkillsInput)
  .handler(async ({ data }) => {
    return await db.insert(resonatorSkills).values(data).returning()
  })

export const updateResonatorSkill = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorSkillUpdateInput)
  .handler(async ({ data }) => {
    const { id, ...values } = data

    const [skill] = await db
      .update(resonatorSkills)
      .set(values)
      .where(eq(resonatorSkills.id, id))
      .returning()

    if (!skill) {
      throw new Error("Habilidad no encontrada")
    }

    return skill
  })

export const deleteResonatorSkill = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(resonatorSkills)
      .where(eq(resonatorSkills.id, data.id))
      .returning({ id: resonatorSkills.id })

    if (deleted.length === 0) {
      throw new Error("Habilidad no encontrada")
    }

    return deleted[0].id
  })
