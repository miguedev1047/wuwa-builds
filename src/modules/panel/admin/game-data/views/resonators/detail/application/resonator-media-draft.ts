import type { ResonatorMediaRow } from "@/db/schema"
import type { ResonatorMediaUpdateInput } from "@/modules/game-data/application/schemas"

/** Maps a saved media row to the edit form values. */
export function resonatorMediaDraftFromRow(
  media: ResonatorMediaRow
): ResonatorMediaUpdateInput {
  return {
    id: media.id,
    url: media.url,
  }
}
