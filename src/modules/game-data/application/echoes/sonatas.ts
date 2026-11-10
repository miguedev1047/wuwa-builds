import type { SonataSetEffectRow, SonataSetRow } from "@db/schema"
import type {
  SonataEffectInput,
  SonataFormInput,
  SonataInput,
} from "@game-data/application/schemas"
import type { StatId } from "@game-data/application/stats/stats"
import { isStatId } from "@game-data/application/stats/stats"

/**
 * Encore labels (`es`) of every stat a sonata 2-piece can grant.
 *
 * The API does not use the panel vocabulary (`Gelio` vs `Glacio`, `Bonif.` vs
 * `Bono`, `Regen.` vs `Recarga`), so the alias map is explicit instead of
 * matching by text. The two-piece bonuses are percentages, hence the
 * `_percent` keys for `ATQ` and `PS`.
 */
export const SONATA_STAT_ALIASES: Record<string, StatId> = {
  ATQ: "atk_percent",
  PS: "hp_percent",
  "Daño Aero": "aero_dmg",
  "Daño Electro": "electro_dmg",
  "Daño Gelio": "glacio_dmg",
  "Daño Fusión": "fusion_dmg",
  "Daño Destrucción": "havoc_dmg",
  "Daño Espectro": "spectro_dmg",
  "Bonif. de curación": "healing_bonus",
  "Regen. de energía": "energy_regen",
  "Daño de Habilidad de resonancia": "skill_bonus",
}

const STAT_EFFECT = /^(.+?)\s*\+([\d.]+)%\.?$/

/** Reads `"Daño Gelio +10%"` as `{ statId, value }`, or `null` if it is not a plain stat. */
export function parseSonataStat(
  description: string
): { statId: StatId; value: number } | null {
  const match = STAT_EFFECT.exec(description.trim())

  if (!match) return null

  const statId = SONATA_STAT_ALIASES[match[1].trim()]

  if (!statId) return null

  const value = Number(match[2])

  return Number.isFinite(value) ? { statId, value } : null
}

/**
 * Turns an Encore effect into the stored row.
 *
 * Only the 2-piece threshold is a static stat; 1, 3 and 5 piece bonuses are
 * combat triggers. A 2-piece that fails to parse is kept conditional so the
 * builder never adds a number it could not read.
 */
export function toSonataEffectDraft(effect: {
  pieces: number
  description: string
}): SonataEffectInput {
  const parsed =
    effect.pieces === 2 ? parseSonataStat(effect.description) : null

  return {
    pieces: effect.pieces,
    description: effect.description,
    isConditional: parsed === null,
    statId: parsed?.statId ?? null,
    value: parsed?.value ?? null,
  }
}

/** Drops the empty optional slot and returns the payload the server validates. */
export function toSonataInput(values: SonataFormInput): SonataInput {
  return {
    id: values.id,
    name: values.name,
    icon: values.icon,
    color: values.color,
    effects: values.effects
      .filter((effect) => effect.description.trim().length > 0)
      .map((effect) =>
        effect.isConditional
          ? { ...effect, statId: null, value: null }
          : { ...effect }
      ),
  }
}

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

const EMPTY_SLOTS: SonataFormInput["effects"] = [
  {
    pieces: 2,
    description: "",
    isConditional: false,
    statId: null,
    value: null,
  },
  {
    pieces: 5,
    description: "",
    isConditional: true,
    statId: null,
    value: null,
  },
]

/** Maps a saved set to the two-slot edit form. */
export function sonataDraftFromRow(sonata: SonataWithEffects): SonataFormInput {
  const effects = [0, 1].map((index) => {
    const effect = sonata.effects[index]

    if (!effect) return EMPTY_SLOTS[index]

    return {
      pieces: effect.pieces,
      description: effect.description,
      isConditional: effect.isConditional,
      statId: isStatId(effect.statId) ? effect.statId : null,
      value: effect.value,
    }
  })

  return {
    id: sonata.id,
    name: sonata.name,
    icon: sonata.icon,
    color: sonata.color,
    effects: [effects[0], effects[1]],
  }
}
