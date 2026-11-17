import { createInsertSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { resonatorBestWeapons } from "@db/schema"
import { idInput } from "@catalog/application/id"

const resonatorBestWeaponInput = createInsertSchema(resonatorBestWeapons, {
  weaponId: (schema) => schema.min(1, "Selecciona un arma valida"),
}).pick({ weaponId: true })

/** Full replacement payload for a resonator's ordered weapon recommendations. */
export const resonatorBestWeaponsInput = z.object({
  resonatorId: idInput.shape.id,
  weapons: z
    .array(resonatorBestWeaponInput)
    .max(10, "Maximo 10 armas recomendadas")
    .superRefine((weapons, context) => {
      const weaponIds = weapons.map(({ weaponId }) => weaponId)
      if (new Set(weaponIds).size !== weaponIds.length) {
        context.addIssue({
          code: "custom",
          message: "No puedes repetir armas",
        })
      }
    }),
})

/** Selected ids as strings for the MultiComboboxField form state. */
export const resonatorBestWeaponsSelectionInput = z.object({
  weaponIds: z.array(z.string().min(1)).max(10, "Maximo 10 armas recomendadas"),
})

export type ResonatorBestWeaponsInput = z.infer<
  typeof resonatorBestWeaponsInput
>
