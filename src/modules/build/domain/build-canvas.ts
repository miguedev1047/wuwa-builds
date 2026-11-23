import type {
  BuildProps,
  EchoesDataProps,
  ResonatorDataProps,
  WeaponDataProps,
} from "@build/domain/build-record"
import type { CharacterCalculationResult } from "@build/domain/character-stats"
import type {
  CharacterDetail,
  CharacterSummary,
} from "@catalog/domain/character"
import type { EchoSummary } from "@catalog/domain/echo"
import type { WeaponDetail, WeaponSummary } from "@catalog/domain/weapon"

/** Echo slot display fields shared by the canvas and the editor. */
export type BuildCanvasEcho = Omit<EchoesDataProps, "data"> & {
  data: Pick<EchoSummary, "id" | "name" | "icon"> | null
}

/** Parts of a hydrated build that the read-only canvas paints. */
export type BuildCanvasData = Pick<
  BuildProps,
  "backgroundIndex" | "mainEchoSlot"
> & {
  resonator: Omit<ResonatorDataProps, "data"> & {
    data: Pick<
      CharacterSummary,
      "name" | "rarity" | "element" | "iconLarge"
    > | null
  }
  weapon: Omit<WeaponDataProps, "data"> & {
    data: Pick<WeaponSummary, "name" | "icon"> | null
  }
  echoes: BuildCanvasEcho[]
}

type CanvasSequence = CharacterDetail["sequences"][number]
type CanvasSkill = CharacterDetail["skills"][number]
type CanvasPassive = CharacterDetail["passives"][number]
type WeaponProperty = WeaponDetail["properties"][number]

export type BuildCanvasSkills = {
  skills: Pick<CanvasSkill, "id" | "skillId" | "name" | "icon">[]
  passives: Pick<
    CanvasPassive,
    "id" | "passiveId" | "title" | "valueNumber" | "icon"
  >[]
}

export type BuildCanvasWeaponProperty = Pick<WeaponProperty, "id" | "name"> & {
  growth: Pick<
    WeaponProperty["growth"][number],
    "level" | "valueNumber" | "valueText"
  >[]
}

export type BuildCanvasEchoDetail = {
  id: number
  sets: { setId: number; sonata: { icon: string } | null }[]
}

/** Resolved catalog details and stats needed by the standalone card. */
export type BuildCanvasPreview = {
  resonator?: BuildCanvasSkills & {
    sequences: (Pick<CanvasSequence, "id" | "name" | "icon" | "index"> & {
      description?: string
    })[]
  }
  weapon?: { properties: BuildCanvasWeaponProperty[] }
  echoDetails?: BuildCanvasEchoDetail[]
  result: Pick<CharacterCalculationResult, "stats"> | null
}
