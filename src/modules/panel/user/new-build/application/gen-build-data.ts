import { ECHO_LEVEL_MAX } from "@/modules/builds/domain/build"
import type { EchoesDataProps } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type { CharacterDetail } from "@/modules/game-data/domain/character"

const ORDERED_INDEX = [0, 1, 8, 2, 3, 4, 5, 9, 6, 7]

const GENERATE_ECHOES_NUMBER = 5
const GENERATE_ECHO_SUBSTATS_NUMBER = 5

export const genResonatorSkills = (skills: CharacterDetail["skills"]) => {
  const resonatorSkills = skills.map((skill) => ({
    id: skill.id,
    skillId: skill.skillId,
    level: 10,
  }))
  return resonatorSkills
}

export const genResonatorPassives = (resonator: CharacterDetail) => {
  const rawPassives = [
    ...resonator.passives.map((p) => ({
      id: p.id,
      passiveId: p.passiveId,
      name: p.title,
      value: p.valueNumber,
      icon: p.icon,
      type: "passive" as const,
    })),
    ...resonator.skills.slice(5, 7).map((s) => ({
      id: s.id,
      passiveId: s.skillId,
      name: s.name,
      value: 0,
      icon: s.icon,
      type: "skill" as const,
    })),
  ]

  return ORDERED_INDEX.map((index) => rawPassives[index])
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .map((item) => ({ ...item, enabled: true }))
}

export const genEchoes = (): EchoesDataProps[] => {
  return Array.from({ length: GENERATE_ECHOES_NUMBER }).map((_, index) => ({
    data: null,
    echoSet: "",
    mainStatLabel: "",
    index,
    mainStatValue: 0,
    level: ECHO_LEVEL_MAX,
    cost: 0,
    substats: Array.from({ length: GENERATE_ECHO_SUBSTATS_NUMBER }).map(
      (_, substatIndex) => ({
        index: substatIndex,
        valueLabel: "",
        valueNumber: 0,
      })
    ),
  }))
}
