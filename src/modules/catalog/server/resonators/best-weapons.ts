import { db } from "@/db"
import { resonatorBestWeapons } from "@db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { resonatorBestWeaponsInput } from "@catalog/application/schemas"

/** Replaces a resonator's weapon recommendations, retaining the form order. */
export const replaceResonatorBestWeapons = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorBestWeaponsInput)
  .handler(async ({ data }) => {
    const remove = db
      .delete(resonatorBestWeapons)
      .where(eq(resonatorBestWeapons.resonatorId, data.resonatorId))

    if (data.weapons.length === 0) {
      await remove
    } else {
      await db.batch([
        remove,
        db.insert(resonatorBestWeapons).values(
          data.weapons.map(({ weaponId }, index) => ({
            resonatorId: data.resonatorId,
            weaponId,
            sortOrder: index + 1,
          }))
        ),
      ])
    }

    return data.weapons
  })
