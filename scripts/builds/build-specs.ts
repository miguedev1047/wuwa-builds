/**
 * Curated showcase builds for the local catalog.
 *
 * Specs only reference catalog ids; the generator resolves names, icons, main
 * stat values and every derived stat from D1. A spec fails loudly when an id,
 * a set membership or a substat roll is not valid for the echo cost.
 */

export interface BuildSubstatSpec {
  statId: string
  value: number
}

export interface BuildEchoSpec {
  echoId: number
  setId: number
  mainStatId: string
  substats: BuildSubstatSpec[]
}

export interface BuildSpec {
  slug: string
  name: string
  characterId: number
  weaponId: number
  refinementRank: number
  sequenceRank: number
  mainEchoSlot: number
  backgroundIndex: number
  notes: string
  echoes: BuildEchoSpec[]
}

const critRateSubstats = [
  { statId: "crit_rate", value: 10.5 },
  { statId: "crit_rate", value: 9.9 },
  { statId: "crit_rate", value: 9.3 },
  { statId: "crit_rate", value: 8.7 },
]

const critDamageSubstats = [
  { statId: "crit_dmg", value: 21 },
  { statId: "crit_dmg", value: 19.8 },
  { statId: "crit_dmg", value: 18.6 },
  { statId: "crit_dmg", value: 17.4 },
  { statId: "crit_dmg", value: 21 },
]

function offensiveEcho(
  echoId: number,
  setId: number,
  mainStatId: string,
  index: number,
  bonusStatId: string,
  secondaryBonusStatId: string
): BuildEchoSpec {
  const critRate = critRateSubstats[index]
  const critDamage = critDamageSubstats[index]
  const energy = index === 1 ? 10 : 10.8
  const flatAtk = index === 1 ? 60 : 50

  const substats: BuildSubstatSpec[] =
    index === 4
      ? [
          critDamage,
          { statId: "atk_percent", value: 11.6 },
          { statId: "atk", value: 60 },
          { statId: bonusStatId, value: 11.6 },
          { statId: secondaryBonusStatId, value: 11.6 },
        ]
      : [
          critRate,
          critDamage,
          { statId: "atk_percent", value: 11.6 },
          index === 3
            ? { statId: bonusStatId, value: 11.6 }
            : { statId: "energy_regen", value: energy },
          index === 3
            ? { statId: "atk", value: flatAtk }
            : { statId: bonusStatId, value: 11.6 },
        ]

  return { echoId, setId, mainStatId, substats }
}

/** Five showcased builds, one per element, all using signature weapons. */
export const BUILD_SPECS: readonly BuildSpec[] = [
  {
    slug: "cartethyia",
    name: "Dama del Vendaval",
    characterId: 1409,
    weaponId: 21020056,
    refinementRank: 1,
    sequenceRank: 0,
    mainEchoSlot: 0,
    backgroundIndex: 2,
    notes:
      "DPS Aero que escala con Vida. Fleurdelys como eco principal suma un 20% de Daño Aero; Kelpie completa el segundo 4-coste del set Peregrinaje al viento. Busca Vida%, CRIT y algo de Regen. de energía para sostener la rotación.",
    echoes: [
      {
        echoId: 6000106,
        setId: 17,
        mainStatId: "crit_rate",
        substats: [
          { statId: "crit_rate", value: 10.5 },
          { statId: "crit_dmg", value: 21 },
          { statId: "hp_percent", value: 11.6 },
          { statId: "energy_regen", value: 10.8 },
          { statId: "basic_atk_bonus", value: 11.6 },
        ],
      },
      {
        echoId: 6000113,
        setId: 17,
        mainStatId: "crit_dmg",
        substats: [
          { statId: "crit_rate", value: 9.9 },
          { statId: "crit_dmg", value: 19.8 },
          { statId: "hp_percent", value: 11.6 },
          { statId: "hp", value: 580 },
          { statId: "liberation_bonus", value: 11.6 },
        ],
      },
      {
        echoId: 6000103,
        setId: 17,
        mainStatId: "hp_percent",
        substats: [
          { statId: "crit_rate", value: 9.3 },
          { statId: "crit_dmg", value: 18.6 },
          { statId: "hp_percent", value: 11.6 },
          { statId: "hp", value: 540 },
          { statId: "basic_atk_bonus", value: 11.6 },
        ],
      },
      {
        echoId: 6000100,
        setId: 17,
        mainStatId: "hp_percent",
        substats: [
          { statId: "crit_rate", value: 8.7 },
          { statId: "crit_dmg", value: 17.4 },
          { statId: "hp_percent", value: 11.6 },
          { statId: "energy_regen", value: 10 },
          { statId: "liberation_bonus", value: 11.6 },
        ],
      },
      {
        echoId: 6000110,
        setId: 17,
        mainStatId: "hp_percent",
        substats: [
          { statId: "crit_dmg", value: 21 },
          { statId: "hp_percent", value: 11.6 },
          { statId: "hp", value: 580 },
          { statId: "basic_atk_bonus", value: 11.6 },
          { statId: "liberation_bonus", value: 11.6 },
        ],
      },
    ],
  },
  {
    slug: "carlotta",
    name: "El Último Baile",
    characterId: 1107,
    weaponId: 21030016,
    refinementRank: 1,
    sequenceRank: 0,
    mainEchoSlot: 0,
    backgroundIndex: 7,
    notes:
      "DPS Glacio de Habilidad y Liberación. Sentry Construct aporta Glacio y Daño de Habilidad; el set Resolución helada premia encadenar Habilidades de resonancia. Prioriza CRIT, ATK% y Regen. de energía.",
    echoes: [
      offensiveEcho(
        6000083,
        10,
        "crit_rate",
        0,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000073,
        10,
        "glacio_dmg",
        1,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000076,
        10,
        "glacio_dmg",
        2,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000069,
        10,
        "atk_percent",
        3,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000072,
        10,
        "atk_percent",
        4,
        "skill_bonus",
        "liberation_bonus"
      ),
    ],
  },
  {
    slug: "changli",
    name: "Fénix de Jinzhou",
    characterId: 1205,
    weaponId: 21020016,
    refinementRank: 1,
    sequenceRank: 0,
    mainEchoSlot: 0,
    backgroundIndex: 11,
    notes:
      "DPS Fusión de Habilidad. El catálogo no tiene dos 3-costes de Grieta fundida, así que la build usa 2P Grieta fundida + 2P Huella llameante y un 3-coste libre. El Jinete Infernal de Pesadilla es el eco principal.",
    echoes: [
      offensiveEcho(
        6000091,
        2,
        "crit_rate",
        0,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000120,
        18,
        "fusion_dmg",
        1,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000046,
        4,
        "fusion_dmg",
        2,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000054,
        2,
        "atk_percent",
        3,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000107,
        18,
        "atk_percent",
        4,
        "skill_bonus",
        "liberation_bonus"
      ),
    ],
  },
  {
    slug: "camellya",
    name: "Flor de Costa Negra",
    characterId: 1603,
    weaponId: 21020026,
    refinementRank: 1,
    sequenceRank: 0,
    mainEchoSlot: 0,
    backgroundIndex: 5,
    notes:
      "DPS Destrucción de Ataque básico. Eclipse de sol en descenso no tiene 3-costes en el catálogo, así que la build combina 2P Eclipse + 2P Melodías perdurables y un 3-coste libre. Pesadilla: Destronado como eco principal.",
    echoes: [
      offensiveEcho(
        6000090,
        6,
        "crit_dmg",
        0,
        "basic_atk_bonus",
        "heavy_atk_bonus"
      ),
      offensiveEcho(
        6020007,
        9,
        "havoc_dmg",
        1,
        "basic_atk_bonus",
        "heavy_atk_bonus"
      ),
      offensiveEcho(
        6000096,
        16,
        "havoc_dmg",
        2,
        "basic_atk_bonus",
        "heavy_atk_bonus"
      ),
      offensiveEcho(
        6000047,
        6,
        "atk_percent",
        3,
        "basic_atk_bonus",
        "heavy_atk_bonus"
      ),
      offensiveEcho(
        6000054,
        9,
        "atk_percent",
        4,
        "basic_atk_bonus",
        "heavy_atk_bonus"
      ),
    ],
  },
  {
    slug: "jinhsi",
    name: "Magistrada del Alba",
    characterId: 1304,
    weaponId: 21010026,
    refinementRank: 1,
    sequenceRank: 0,
    mainEchoSlot: 0,
    backgroundIndex: 13,
    notes:
      "DPS Espectro de Habilidad y Liberación. Jué es el eco principal y Luz celestial el set de 5 piezas. La build prioriza Daño de Habilidad, CRIT y ATK% para maximizar la ventana de la Magistrada.",
    echoes: [
      offensiveEcho(
        6000059,
        5,
        "crit_dmg",
        0,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000058,
        5,
        "spectro_dmg",
        1,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000049,
        5,
        "spectro_dmg",
        2,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6020012,
        5,
        "atk_percent",
        3,
        "skill_bonus",
        "liberation_bonus"
      ),
      offensiveEcho(
        6000051,
        5,
        "atk_percent",
        4,
        "skill_bonus",
        "liberation_bonus"
      ),
    ],
  },
]
