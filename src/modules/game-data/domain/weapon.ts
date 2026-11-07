import type {
  WeaponPropertyGrowthRow,
  WeaponPropertyRow,
  WeaponRefinementRow,
  WeaponRefinementStatRow,
  WeaponRow,
} from "@/db/schema"

/** List row: every scalar column of the canonical weapon table. */
export type WeaponSummary = WeaponRow

/** Weapon with the catalog relations needed by the builder calculation. */
export interface WeaponDetail extends WeaponRow {
  properties: (WeaponPropertyRow & { growth: WeaponPropertyGrowthRow[] })[]
  refinements: (WeaponRefinementRow & { stats: WeaponRefinementStatRow[] })[]
}
