import { db } from "@/db"
import { resonatorTags } from "@/db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { resonatorTagsInput } from "@/modules/game-data/application/schemas"

/** Replaces the tags of a resonator: delete everything, then insert the new set. */
export const replaceResonatorTags = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorTagsInput)
  .handler(async ({ data }) => {
    const remove = db
      .delete(resonatorTags)
      .where(eq(resonatorTags.resonatorId, data.resonatorId))

    if (data.tags.length === 0) {
      await remove
    } else {
      await db.batch([
        remove,
        db.insert(resonatorTags).values(
          data.tags.map((tag, sortOrder) => ({
            ...tag,
            resonatorId: data.resonatorId,
            sortOrder,
          }))
        ),
      ])
    }

    return data.tags
  })
