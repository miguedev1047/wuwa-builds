import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import type { WeaponSummary } from "@/modules/game-data/domain/weapon"
import type { EchoSummary } from "@/modules/game-data/domain/echo"

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
  valueNumber: number
}

export interface EchoesDataProps {
  data: EchoSummary | null
  index: number
  echoSet: string
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
  data: CharacterSummary
  skills: ResonatorSkillsDataProps[]
  passives: ResonatorPassivesDataProps[]
}

export interface BuildProps {
  buildId: string
  sessionId: string
  name: string
  resonator: ResonatorDataProps
  weapon: WeaponDataProps
  echoes: EchoesDataProps[]
  createdAt: string
  updateAt: string
}

export const buildCollection = createCollection(
  localStorageCollectionOptions<BuildProps>({
    id: "builds",
    storageKey: "builds",
    getKey: (item) => item.buildId,
  })
)
