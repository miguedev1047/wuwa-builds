import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import {
  idInput,
  resonatorInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { adminMiddleware } from "@/functions/middlewares"
import { resonators } from "@/db/schema"

export const getCharacters = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.query.resonators.findMany()
  })

export const getCharacter = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .middleware([adminMiddleware])
  .validator(idInput)
  .handler(async ({ data }) => {
    const character = db.query.resonators.findFirst({
      where: {
        id: data.id,
      },
    })

    return character
  })

export const createResonator = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorInput)
  .handler(async ({ data }) => {
    const [resonator] = await db.insert(resonators).values(data).returning()

    return resonator
  })
