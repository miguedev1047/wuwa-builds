import { db } from "@/db"
import { createServerFn } from "@tanstack/react-start"
import { idInput } from "@/modules/panel/admin/game-data/application/schemas"

export const getWeapons = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.query.weapons.findMany({ orderBy: { id: "asc" } })
  }
)

export const getWeapon = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .validator(idInput)
  .handler(async ({ data }) => {
    return await db.query.weapons.findFirst({
      where: {
        id: data.id,
      },
    })
  })
