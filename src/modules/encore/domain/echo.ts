export interface EncoreEchoSetEffect {
  key: number
  description: string
}

export interface EncoreEchoSet {
  id: number
  name: string
  icon: string
  effects: EncoreEchoSetEffect[]
}

/**
 * Echo tiers, in ascending class order.
 *
 * Encore reports the tier as `Rarity`, which is **not** the star rating of the
 * echo: `0` is a common 1-cost echo, `1` an elite 3-cost one, and `2`/`3` the
 * 4-cost boss and calamity tiers. The star rating only exists as `QualityId`,
 * which the panel edits by hand.
 */
export const ECHO_TIERS = [
  { class: 0, cost: 1 },
  { class: 1, cost: 3 },
  { class: 2, cost: 4 },
  { class: 3, cost: 4 },
] as const

/** Maps an Encore `Rarity` tier to its echo class and build cost. */
export function echoTier(rarity: number) {
  return ECHO_TIERS[rarity] ?? ECHO_TIERS[0]
}

export interface EncoreEchoSummary {
  id: number
  name: string
  class: number
  cost: number
  icon: string
  sets: EncoreEchoSet[]
}

export interface EncoreEchoSkill {
  description: string
  cooldown: number
  damage: unknown[]
}

export interface EncoreEchoDetail extends EncoreEchoSummary {
  skill: EncoreEchoSkill | null
}
