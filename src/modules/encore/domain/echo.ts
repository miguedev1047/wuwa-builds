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

export interface EncoreEchoSummary {
  id: number
  name: string
  rarity: number
  element: string
  icon: string
  sets: EncoreEchoSet[]
}

export interface EncoreEchoSkill {
  description: string
  cooldown: number
  damage: unknown[]
}

export interface EncoreEchoDetail extends EncoreEchoSummary {
  description: string
  skill: EncoreEchoSkill | null
}
