import type { CharacterSummary } from "@game-data/domain/character"
import type { EchoSummary } from "@game-data/domain/echo"
import type { WeaponSummary } from "@game-data/domain/weapon"

export interface ResonatorPassivesDataProps {
  id: number
  passiveId: number
  name: string
  value: number
  icon: string
  type: "skill" | "passive"
  enabled: boolean
}

export interface ResonatorSkillsDataProps {
  id: number
  skillId: number
  level: number
}

export interface EchoSubstatsDataProps {
  index: number
  valueLabel: string
  valueStat: string
  valueNumber: number
}

export interface EchoesDataProps {
  data: EchoSummary | null
  index: number
  echoSetId: number | null
  mainStatStat: string
  mainStatLabel: string
  mainStatValue: number
  level: number
  cost: number
  substats: EchoSubstatsDataProps[]
}

export interface WeaponDataProps {
  level: number
  refinament: number
  data: WeaponSummary | null
}

export interface ResonatorDataProps {
  level: number
  sequency: number
  data: CharacterSummary | null
  skills: ResonatorSkillsDataProps[]
  passives: ResonatorPassivesDataProps[]
}

/** Local build document stored in the TanStack DB collection. */
export interface BuildProps {
  buildId: string
  sessionId: string
  backgroundIndex: number | null
  name: string
  resonator: ResonatorDataProps
  weapon: WeaponDataProps
  echoes: EchoesDataProps[]
  mainEchoSlot: number | null
  createdAt: string
  updateAt: string
}
