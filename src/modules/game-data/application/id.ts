import { z } from "zod"

/** Positive database id used by the single-row server functions. */
export const idInput = z.object({
  id: z.number().int().positive(),
})

export type IdInput = z.infer<typeof idInput>

/** Database ids are positive integers; guard client actions before mutating. */
export function isValidId(id: number): boolean {
  return Number.isInteger(id) && id > 0
}
