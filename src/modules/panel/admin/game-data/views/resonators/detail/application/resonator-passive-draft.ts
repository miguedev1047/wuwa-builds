import type { ResonatorPassiveRow } from "@db/schema"
import { numberConverter } from "@/lib/number-converter"
import type { EncorePassive } from "@encore/domain/character"
import type {
  ResonatorPassiveInput,
  ResonatorPassiveUpdateInput,
} from "@game-data/application/schemas"

/** Maps a saved passive row to the edit form values. */
export function resonatorPassiveDraftFromRow(
  passive: ResonatorPassiveRow
): ResonatorPassiveUpdateInput {
  return {
    id: passive.id,
    resonatorId: passive.resonatorId,
    passiveId: passive.passiveId,
    sortOrder: passive.sortOrder,
    title: passive.title,
    valueNumber: passive.valueNumber,
    icon: passive.icon,
  }
}

/** Payloads for the selected Encore passives, in Encore order. */
export function resonatorPassivePayloads(
  selectedIds: string[],
  encorePassives: EncorePassive[],
  resonatorId: number,
  firstSortOrder: number
): ResonatorPassiveInput[] {
  return encorePassives
    .filter((passive) => selectedIds.includes(String(passive.id)))
    .map((passive, index) => ({
      resonatorId,
      passiveId: passive.id,
      sortOrder: firstSortOrder + index,
      title: passive.title,
      valueNumber: numberConverter({ input: passive.description }),
      icon: passive.icon,
    }))
}
