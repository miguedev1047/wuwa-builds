import type {
  ResonatorPassiveRow,
  ResonatorPropertyGrowthRow,
  ResonatorPropertyRow,
  ResonatorRow,
  ResonatorSequenceRow,
  ResonatorSkillRow,
  ResonatorTagRow,
} from "@/db/schema"

/** List row: every scalar column of the canonical resonator table. */
export type CharacterSummary = ResonatorRow

/** Upgradeable skill reference used to seed draft levels. */
export type CharacterSkill = Pick<
  ResonatorSkillRow,
  "skillId" | "type" | "name"
>

/** Canonical detail with every relation the admin and builder screens read. */
export interface CharacterDetail extends ResonatorRow {
  tags: ResonatorTagRow[]
  properties: (ResonatorPropertyRow & {
    growth: ResonatorPropertyGrowthRow[]
  })[]
  skills: ResonatorSkillRow[]
  sequences: ResonatorSequenceRow[]
  passives: ResonatorPassiveRow[]
}

/**
 * Growth values keep their original type: a number for most stats and a
 * percentage string (`"5%"`) for CRIT rate/damage.
 */
export function growthValue(
  row: Pick<ResonatorPropertyGrowthRow, "valueNumber" | "valueText">
): number | string {
  if (row.valueNumber !== null) return row.valueNumber
  return row.valueText ?? 0
}
