import { z } from "zod"

/** Positive database id used by the single-row server functions. */
export const idInput = z.object({
  id: z.number().int().positive(),
})

export type IdInput = z.infer<typeof idInput>

/** Positive database ids used by bulk detail reads. */
export const idsInput = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(5),
})

export type IdsInput = z.infer<typeof idsInput>

/** Database ids are positive integers; guard client actions before mutating. */
export function isValidId(id: number): boolean {
  return Number.isInteger(id) && id > 0
}
