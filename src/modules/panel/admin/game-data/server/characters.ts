import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { idInput } from "@/modules/panel/admin/game-data/application/schemas"
import { adminMiddleware } from "@/functions/middlewares"

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
