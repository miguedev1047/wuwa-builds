import type { BuildProps } from "@build/domain/build-record"
import type { CharacterCalculationResult } from "@build/domain/character-stats"
import type { CharacterDetail } from "@catalog/domain/character"
import type { EchoDetail } from "@catalog/domain/echo"
import type { WeaponDetail } from "@catalog/domain/weapon"
import type { ProfileRosterCard } from "@home/domain/profile-roster"

type ProfileCardSources = {
  build: BuildProps
  resonator: CharacterDetail
  weapon: WeaponDetail | null
  echoDetails: EchoDetail[]
  result: CharacterCalculationResult | null
}

/** Projects the hydrated build and catalog onto the public card fields. */
export function toProfileRosterCard({
  build,
  resonator,
  weapon,
  echoDetails,
  result,
}: ProfileCardSources): ProfileRosterCard {
  const { name, rarity, element, iconLarge } = resonator

  return {
    buildId: build.buildId,
    build: {
      backgroundIndex: build.backgroundIndex,
      mainEchoSlot: build.mainEchoSlot,
      resonator: {
        ...build.resonator,
        data: { name, rarity, element, iconLarge },
      },
      weapon: {
        ...build.weapon,
        data: weapon && { name: weapon.name, icon: weapon.icon },
      },
      echoes: build.echoes.map(({ data, ...slot }) => ({
        ...slot,
        data: data && { id: data.id, name: data.name, icon: data.icon },
      })),
    },
    preview: {
      resonator: {
        sequences: resonator.sequences.map(({ id, name, icon, index }) => ({
          id,
          name,
          icon,
          index,
        })),
        skills: resonator.skills.map(({ id, skillId, name, icon }) => ({
          id,
          skillId,
          name,
          icon,
        })),
        passives: resonator.passives.map(
          ({ id, passiveId, title, valueNumber, icon }) => ({
            id,
            passiveId,
            title,
            valueNumber,
            icon,
          })
        ),
      },
      weapon: weapon
        ? {
            properties: weapon.properties.map(({ id, name, growth }) => ({
              id,
              name,
              growth: growth.map(({ level, valueNumber, valueText }) => ({
                level,
                valueNumber,
                valueText,
              })),
            })),
          }
        : undefined,
      echoDetails: echoDetails.map(({ id, sets }) => ({
        id,
        sets: sets.map(({ setId, sonata }) => ({
          setId,
          sonata: sonata && { icon: sonata.icon },
        })),
      })),
      result: result && { stats: result.stats },
    },
  }
}
