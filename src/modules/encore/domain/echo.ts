import type {
  EchoClassId,
  EchoCost,
} from "@/modules/game-data/domain/categories"
export interface EncoreEchoSetEffect {
  key: number
  description: string
}

export interface EncoreEchoSet {
  id: number
  name: string
  icon: string
  /**
   * Piece-threshold effects of the Sonata set. Named like the catalog relation
   * (`echoSets.sonataEffects`) so both echo payloads use one vocabulary.
   */
  sonataEffects: EncoreEchoSetEffect[]
}

export interface EncoreEchoSummary {
  id: number
  name: string
  class: EchoClassId
  cost: EchoCost
  icon: string
  sets: EncoreEchoSet[]
}

export interface EncoreEchoSkill {
  description: string
  simpleDescription: string
  icon: string
}

export interface EncoreEchoDetail extends EncoreEchoSummary {
  skill: EncoreEchoSkill | null
}
