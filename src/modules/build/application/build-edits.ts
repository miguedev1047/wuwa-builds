import { DEFAULT_BUILD_NAME } from "@build/application/factories/build"
import { selectEchoSlot } from "@build/application/select-echo-slot"
import { selectResonatorPatch } from "@build/application/select-resonator-patch"
import type { BuildProps } from "@build/domain/build-record"
import type {
  CharacterDetail,
  CharacterSummary,
} from "@catalog/domain/character"
import type { EchoSummary } from "@catalog/domain/echo"
import type { WeaponSummary } from "@catalog/domain/weapon"

/** Apply one edit to the current local draft. */
export const buildEdits = {
  rename(draft: BuildProps, name: string) {
    draft.name = name
    draft.updateAt = new Date().toISOString()
  },

  selectResonator(
    draft: BuildProps,
    character: CharacterSummary,
    detail: CharacterDetail
  ) {
    const patch = selectResonatorPatch({
      current: draft.resonator,
      character,
      detail,
    })
    if (!patch) return false

    if (!draft.resonator.data && draft.name === DEFAULT_BUILD_NAME) {
      draft.name = `Build de ${character.name}`
    }

    draft.resonator = patch.resonator
    if (patch.weapon) draft.weapon = patch.weapon
    draft.updateAt = new Date().toISOString()
    return true
  },

  selectWeapon(draft: BuildProps, weapon: WeaponSummary) {
    draft.weapon.data = weapon
    draft.updateAt = new Date().toISOString()
  },

  selectEcho(draft: BuildProps, targetIndex: number, echo: EchoSummary) {
    draft.echoes = selectEchoSlot({ echoes: draft.echoes, targetIndex, echo })
    draft.updateAt = new Date().toISOString()
  },
}
