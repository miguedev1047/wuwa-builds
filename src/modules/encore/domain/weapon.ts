import type { EncoreProperty } from "./property"

export interface EncoreWeaponSummary {
  id: number
  name: string
  rarity: number
  type: number
  typeName: string
  icon: string
}

/** One stat a refinement rank grants, as the builder consumes it. */
export interface EncoreWeaponRefinementStat {
  /** Stat name as the builder knows it (`HP%`, `ATK`, `CRIT Rate`). */
  name: string
  /** Amount as the game shows it, e.g. `20` for +20%. */
  value: number
}

/** One refinement rank (1 to 5) and the stats it grants. */
export interface EncoreWeaponRefinement {
  /** Refinement rank, 1 to 5. */
  rank: number
  /** `ResonName`: the passive title, shared by the five ranks. */
  name: string
  /** Effect text for this rank, already expanded from the `Desc` template. */
  effect: string
  /** Authored by hand; the API mapper always returns an empty list. */
  stats: EncoreWeaponRefinementStat[]
}

export interface EncoreWeaponDetail extends EncoreWeaponSummary {
  description: string
  properties: EncoreProperty[]
  refinements: EncoreWeaponRefinement[]
}
