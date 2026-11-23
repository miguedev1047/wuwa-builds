import { z } from "zod"

/** Validates the account identifier used by the profile route. */
export const profileLookupInput = z.object({ userId: z.string().min(1) })

/** Optionally binds a cached read to the session that started it. */
export const profileViewerInput = profileLookupInput.extend({
  viewerId: z.string().min(1).nullable().optional(),
})

/** Identifies a resonator group on the requested profile. */
export const profileRosterLookupInput = profileViewerInput.extend({
  characterId: z.number().int().positive(),
})
