import type {
  EchoRow,
  EchoSetRow,
  EchoSkillBonusRow,
  EchoSkillRow,
  SonataSetEffectRow,
} from "@db/schema"

/** List row: every scalar column of the canonical echo table. */
export type EchoSummary = EchoRow

/** Echo with the catalog relations needed by the builder calculation. */
export interface EchoDetail extends EchoRow {
  sets: (EchoSetRow & { sonataEffects: SonataSetEffectRow[] })[]
  skill: EchoSkillRow | null
  skillBonuses: EchoSkillBonusRow[]
}

/** Lightweight selection rows include only the sonata metadata needed by filters. */
export interface EchoSelectionSummary extends EchoRow {
  sets: Pick<EchoSetRow, "setId" | "name" | "icon">[]
}
