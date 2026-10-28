import { z } from "zod"
import { isResonatorSlug } from "../domain/resonator"

/**
 * Input contracts of the application use cases. Shared by the server functions
 * and the CLI so both validate exactly the same way.
 */

export const slugSchema = z.string().refine(isResonatorSlug, "Invalid slug")

export const getResonatorInput = z.object({
  slug: slugSchema,
})

const requireIdOrSlug = (value: { id?: string; slug?: string }) =>
  Boolean(value.id || value.slug)

export const weaponLookup = z
  .object({
    id: z.string().min(1).optional(),
    slug: slugSchema.optional(),
  })
  .refine(requireIdOrSlug, {
    message: "Provide an id or a slug",
    path: ["id"],
  })

export const echoLookup = weaponLookup

export const echoSetLookup = z
  .object({
    sonataId: z.number().int().optional(),
    slug: slugSchema.optional(),
  })
  .refine((value) => value.sonataId !== undefined || Boolean(value.slug), {
    message: "Provide a sonataId or a slug",
    path: ["sonataId"],
  })

/** Client-facing scrape options: no filesystem paths are accepted. */
export const scrapeRequest = z
  .object({
    force: z.boolean().optional(),
    only: z.array(slugSchema).min(1).max(200).optional(),
    limit: z.number().int().min(1).max(200).optional(),
    concurrency: z.number().int().min(1).max(8).optional(),
    delayMs: z.number().int().min(0).max(10_000).optional(),
  })
  .default({})

export type GetResonatorInput = z.infer<typeof getResonatorInput>
export type WeaponLookup = z.infer<typeof weaponLookup>
export type EchoLookup = z.infer<typeof echoLookup>
export type EchoSetLookup = z.infer<typeof echoSetLookup>
export type ScrapeRequestInput = z.infer<typeof scrapeRequest>
