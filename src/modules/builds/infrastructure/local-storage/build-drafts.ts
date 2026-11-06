import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db"
import type { CharacterSummary } from "@/modules/game-data/domain/character"

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
