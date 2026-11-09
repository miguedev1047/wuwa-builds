import type {
  CharacterDetail,
  CharacterSummary,
} from "@/modules/game-data/domain/character"
import type {
  ResonatorDataProps,
  WeaponDataProps,
} from "../domain/build-record"
import { createEmptyWeapon, createResonatorData } from "./factories/build"

interface ResonatorSelectionInput {
  current: ResonatorDataProps
  character: CharacterSummary
  detail: CharacterDetail
}

export interface ResonatorSelectionPatch {
  resonator: ResonatorDataProps
  /** Present only when replacing an existing resonator. */
  weapon?: WeaponDataProps
}

/**
 * Build fields to replace after picking a resonator.
 *
 * Re-selecting the current resonator is a no-op. Replacing a resonator resets
 * the weapon because its type may no longer be compatible.
 */
export function selectResonatorPatch({
  current,
  character,
  detail,
}: ResonatorSelectionInput): ResonatorSelectionPatch | null {
  if (current.data?.id === character.id) return null

  return {
    resonator: createResonatorData({ character, detail }),
    weapon: current.data ? createEmptyWeapon() : undefined,
  }
}
