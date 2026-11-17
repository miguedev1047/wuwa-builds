import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonatorBestSets } from "@db/schema"
import { idInput } from "@catalog/application/id"

const resonatorBestSetInput = createInsertSchema(resonatorBestSets, {
  setId: (schema) => schema.min(1, "Selecciona un set de sonata valido"),
}).pick({ setId: true })

/** Full replacement payload for a resonator's ordered Sonata set ranking. */
export const resonatorBestSetsInput = z.object({
  resonatorId: idInput.shape.id,
  sets: z
    .array(resonatorBestSetInput)
    .max(10, "Maximo 10 sets recomendados")
    .superRefine((sets, context) => {
      const setIds = sets.map(({ setId }) => setId)
      if (new Set(setIds).size !== setIds.length) {
        context.addIssue({
          code: "custom",
          message: "No puedes repetir sets de sonata",
        })
      }
    }),
})

/** Selected ids as strings for the MultiComboboxField form state. */
export const resonatorBestSetsSelectionInput = z.object({
  setIds: z.array(z.string().min(1)).max(10, "Maximo 10 sets recomendados"),
})

export type ResonatorBestSetsInput = z.infer<typeof resonatorBestSetsInput>
