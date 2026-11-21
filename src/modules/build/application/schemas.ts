import { createSelectSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { builds } from "@db/schemas/builds"
import { buildPayloadSchema, MAX_BUILD_NAME_LENGTH } from "@build/domain/build"

/** Row contract for a saved build, with the JSON payload validated. */
export const buildRowSchema = createSelectSchema(builds).extend({
  payload: buildPayloadSchema,
})

export const buildIdSchema = z.string().min(1)
export const buildNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_BUILD_NAME_LENGTH)
export const characterIdSchema = z.number().int().positive()

export const buildIdInputSchema = z.object({
  buildId: buildIdSchema,
})

export const characterGroupInputSchema = z.object({
  characterId: characterIdSchema,
})

/** Identifies the collection whose session must still be active. */
export const buildsScopeInputSchema = z.object({
  userId: z.string().min(1),
})

/** Public create contract: the session determines ownership and timestamps. */
export const createBuildInputSchema = buildsScopeInputSchema.extend({
  /** Client-owned id; created builds keep the id they already have locally. */
  buildId: buildIdSchema,
  characterId: characterIdSchema.nullable(),
  name: buildNameSchema,
  payload: buildPayloadSchema,
})

/** Public update contract: identity and owner are never client-supplied. */
export const updateBuildInputSchema = z.object({
  buildId: buildIdSchema,
  /** Resonator changes move the grouping column, so it is writable here. */
  characterId: characterIdSchema.nullable().optional(),
  name: buildNameSchema.optional(),
  payload: buildPayloadSchema.optional(),
})

export type BuildRowInput = z.infer<typeof buildRowSchema>
export type CreateBuildInput = z.infer<typeof createBuildInputSchema>
export type UpdateBuildInput = z.infer<typeof updateBuildInputSchema>
export type BuildIdInput = z.infer<typeof buildIdInputSchema>
export type CharacterGroupInput = z.infer<typeof characterGroupInputSchema>
