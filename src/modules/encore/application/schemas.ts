import { z } from "zod"

export const idInput = z.object({
  id: z.number().int().positive(),
})

export type IdInput = z.infer<typeof idInput>
