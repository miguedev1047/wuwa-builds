import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { idInput } from "@/modules/panel/admin/game-data/application/schemas"

export const getEchoes = createServerFn({ method: "GET" }).handler(async () => {
  return await db.query.echoes.findMany({ orderBy: { id: "asc" } })
})

export const getEcho = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .validator(idInput)
  .handler(async ({ data }) => {
    return await db.query.echoes.findFirst({
      where: {
        id: data.id,
      },
    })
  })
