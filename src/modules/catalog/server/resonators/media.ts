import { db } from "@/db"
import { resonators, resonatorsMedia, type NewResonatorRow } from "@db/schema"
import { adminMiddleware } from "@/functions/middlewares"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import {
  isResonatorMediaKind,
  type ResonatorMediaKind,
} from "@catalog/application/constants/resonator"
import { resonatorMediaUpdateInput } from "@catalog/application/schemas"

type ResonatorImageColumns = Pick<
  NewResonatorRow,
  "card" | "icon" | "iconLarge" | "circle" | "portrait"
>

/** Mirror of each media row in the scalar image columns of `resonators`. */
const legacyImageColumn: Record<
  ResonatorMediaKind,
  (url: string) => Partial<ResonatorImageColumns>
> = {
  card: (url) => ({ card: url }),
  icon: (url) => ({ icon: url }),
  iconLarge: (url) => ({ iconLarge: url }),
  circle: (url) => ({ circle: url }),
  portrait: (url) => ({ portrait: url }),
}

/** Updates one image URL and its mirrored column on the resonator. */
export const updateResonatorMedia = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(resonatorMediaUpdateInput)
  .handler(async ({ data }) => {
    const [media] = await db
      .update(resonatorsMedia)
      .set({ url: data.url })
      .where(eq(resonatorsMedia.id, data.id))
      .returning()

    if (!media) {
      throw new Error("Imagen no encontrada")
    }

    if (isResonatorMediaKind(media.kind)) {
      await db
        .update(resonators)
        .set(legacyImageColumn[media.kind](media.url))
        .where(eq(resonators.id, media.resonatorId))
    }

    return media
  })
