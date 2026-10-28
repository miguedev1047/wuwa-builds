import { z } from "zod"

/**
 * Version of the build payload shape. It is not a revision counter: bump it
 * when the JSON document format changes so old rows can be migrated or
 * rejected explicitly.
 */
export const BUILD_DOCUMENT_VERSION = 1

const idSchema = z.string().min(1)

/**
 * V1 build configuration.
 *
 * Only stable catalog identifiers and user selections are stored; the catalog
 * records themselves live in the game-data module and are resolved by ID.
 */
export const buildPayloadSchema = z.object({
  weaponId: idSchema.nullable().default(null),
  echoIds: z.array(idSchema).max(5).default([]),
  echoSetIds: z.array(z.number().int()).max(2).default([]),
  mainEchoId: idSchema.nullable().default(null),
  mainStats: z
    .array(
      z.object({
        slot: z.enum(["4", "3", "1"]),
        statId: idSchema,
      })
    )
    .max(5)
    .default([]),
  substats: z.array(idSchema).max(5).default([]),
  notes: z.string().max(2000).default(""),
})

export type BuildPayload = z.infer<typeof buildPayloadSchema>

export const buildDocumentSchema = z.object({
  documentVersion: z.literal(BUILD_DOCUMENT_VERSION),
  payload: buildPayloadSchema,
})
