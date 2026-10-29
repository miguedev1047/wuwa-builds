import { createSelectSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { builds } from "@/db/schemas/builds"
import { buildPayloadSchema } from "../domain/build"

/** Row contract for a saved build, with the JSON payload validated. */
export const buildRowSchema = createSelectSchema(builds).extend({
  payload: buildPayloadSchema,
})

export const buildIdSchema = z.string().min(1)
export const buildNameSchema = z.string().trim().min(1).max(80)
export const characterIdSchema = z.number().int().positive()

export const buildIdInputSchema = z.object({
  buildId: buildIdSchema,
})

export const characterGroupInputSchema = z.object({
  characterId: characterIdSchema,
})

/** Public create contract: owner, id and timestamps are server-owned. */
export const createBuildInputSchema = z.object({
  characterId: characterIdSchema,
  name: buildNameSchema,
  payload: buildPayloadSchema,
})

/** Public update contract: identity and owner are never client-supplied. */
export const updateBuildInputSchema = z.object({
  buildId: buildIdSchema,
  name: buildNameSchema.optional(),
  payload: buildPayloadSchema.optional(),
})

export type BuildRowInput = z.infer<typeof buildRowSchema>
export type CreateBuildInput = z.infer<typeof createBuildInputSchema>
export type UpdateBuildInput = z.infer<typeof updateBuildInputSchema>
export type BuildIdInput = z.infer<typeof buildIdInputSchema>
export type CharacterGroupInput = z.infer<typeof characterGroupInputSchema>
