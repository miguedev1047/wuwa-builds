import { db } from "@/db"
import { resonatorBestSets } from "@db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { resonatorBestSetsInput } from "@catalog/application/schemas"

/** Replaces a resonator's Sonata set ranking, retaining the form order. */
export const replaceResonatorBestSets = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorBestSetsInput)
  .handler(async ({ data }) => {
    const remove = db
      .delete(resonatorBestSets)
      .where(eq(resonatorBestSets.resonatorId, data.resonatorId))

    if (data.sets.length === 0) {
      await remove
    } else {
      await db.batch([
        remove,
        db.insert(resonatorBestSets).values(
          data.sets.map(({ setId }, index) => ({
            resonatorId: data.resonatorId,
            setId,
            sortOrder: index + 1,
          }))
        ),
      ])
    }

    return data.sets
  })
