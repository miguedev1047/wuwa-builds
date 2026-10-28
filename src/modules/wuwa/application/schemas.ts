import { z } from "zod"
import { isResonatorSlug } from "../domain/resonator"

/**
 * Input contracts of the application use cases. Shared by the server functions
 * and the CLI so both validate exactly the same way.
 */

export const resonatorSlug = z
  .string()
  .refine(isResonatorSlug, "Invalid resonator slug")

export const getResonatorInput = z.object({
  slug: resonatorSlug,
})

/** Client-facing scrape options: no filesystem paths are accepted. */
export const scrapeRequest = z
  .object({
    force: z.boolean().optional(),
    only: z.array(resonatorSlug).min(1).max(200).optional(),
    limit: z.number().int().min(1).max(200).optional(),
    concurrency: z.number().int().min(1).max(8).optional(),
    delayMs: z.number().int().min(0).max(10_000).optional(),
  })
  .default({})

export type GetResonatorInput = z.infer<typeof getResonatorInput>
export type ScrapeRequestInput = z.infer<typeof scrapeRequest>
