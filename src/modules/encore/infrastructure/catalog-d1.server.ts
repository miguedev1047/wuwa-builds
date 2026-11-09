import { eq } from "drizzle-orm"
import type { AppDb } from "@/db/create"
import { numberConverter } from "@/lib/number-converter"
import {
  echoSets,
  echoSkills,
  echoes,
  resonatorPassives,
  resonatorPropertyLevels,
  resonatorPropertyGrowth,
  resonatorSequences,
  resonatorSkills,
  resonatorTags,
  resonators,
  resonatorsMedia,
  weaponRefinementStats,
  weaponRefinements,
  weaponProperties,
  weaponPropertyGrowth,
  weapons,
  type ResonatorRow,
} from "@/db/schema"
import type { EncoreCharacterDetail } from "../domain/character"
import {
  isResonatorMediaKind,
  RESONATOR_MEDIA_KINDS,
} from "@/modules/game-data/application/constants/resonator"
import type {
  EncoreEchoDetail,
  EncoreEchoSet,
  EncoreEchoSummary,
} from "../domain/echo"
import type {
  EncoreWeaponDetail,
  EncoreWeaponRefinementStat,
  EncoreWeaponSummary,
} from "../domain/weapon"

/**
 * D1 adapter for the Encore catalog (see `src/db/schemas/resonators.ts`,
 * `weapons.ts` and `echoes.ts`).
 *
 * Writes are whole-document: saving an entity deletes and re-inserts it, so a
 * game patch that drops a skill or reorders properties never leaves stale rows
 * behind. Reads rebuild the same `Encore*` domain object the API mapper
 * produces, so callers do not care where the data came from.
 *
 * The delete relies on `ON DELETE CASCADE`, which D1 enables by default. A
 * custom SQLite connection (scripts, tests) must run `PRAGMA foreign_keys = ON`
 * or the re-insert will collide with the orphaned rows.
 */

/** Escape hatch for the insert returning clause used to link child rows. */
type InsertedId = { id: number; sortOrder: number }

/**
 * `EncorePropertyGrowth.value` is a number for most stats and a percentage
 * string (`"5%"`) for CRIT rate/damage. Splitting it into two columns keeps the
 * original type instead of coercing it.
 */
function growthValueColumns(value: number | string) {
  return typeof value === "number"
    ? { valueNumber: value, valueText: null }
    : { valueNumber: null, valueText: value }
}

function growthValueFromRow(row: {
  valueNumber: number | null
  valueText: string | null
}): number | string {
  if (row.valueNumber !== null) return row.valueNumber
  return row.valueText ?? 0
}

export async function saveCharacter(
  db: AppDb,
  character: EncoreCharacterDetail
): Promise<void> {
  await db.delete(resonators).where(eq(resonators.id, character.id))

  await db.insert(resonators).values({
    id: character.id,
    name: character.name,
    introduction: character.introduction,
    rarity: character.rarity,
    element: character.element,
    weaponType: character.weaponType,
    icon: character.icon,
    card: character.images.card,
    iconLarge: character.images.iconLarge,
    circle: character.images.circle,
    portrait: character.images.portrait,
  })

  await db.insert(resonatorsMedia).values(
    RESONATOR_MEDIA_KINDS.map((kind, sortOrder) => ({
      resonatorId: character.id,
      kind,
      url: character.images[kind],
      sortOrder,
    }))
  )

  if (character.tags.length > 0) {
    await db.insert(resonatorTags).values(
      character.tags.map((tag, sortOrder) => ({
        resonatorId: character.id,
        sortOrder,
        name: tag.name,
        description: tag.description,
        color: tag.color,
        icon: tag.icon,
      }))
    )
  }

  if (character.properties.length > 0) {
    const inserted = (await db
      .insert(resonatorPropertyLevels)
      .values(
        character.properties.map((property, sortOrder) => ({
          resonatorId: character.id,
          sortOrder,
          name: property.name,
          icon: property.icon,
          baseValue: property.baseValue,
        }))
      )
      .returning({
        id: resonatorPropertyLevels.id,
        sortOrder: resonatorPropertyLevels.sortOrder,
      })) as InsertedId[]

    const growth = inserted.flatMap((row) =>
      character.properties[row.sortOrder].growth.map((entry, sortOrder) => ({
        propertyId: row.id,
        sortOrder,
        level: entry.level,
        ...growthValueColumns(entry.value),
      }))
    )

    if (growth.length > 0) {
      await db.insert(resonatorPropertyGrowth).values(growth)
    }
  }

  if (character.skills.length > 0) {
    await db.insert(resonatorSkills).values(
      character.skills.map((skill, sortOrder) => ({
        resonatorId: character.id,
        skillId: skill.id,
        sortOrder,
        type: skill.type,
        name: skill.name,
        description: skill.description,
        icon: skill.icon,
        media: skill.media,
      }))
    )
  }

  if (character.sequences.length > 0) {
    await db.insert(resonatorSequences).values(
      character.sequences.map((sequence, sortOrder) => ({
        resonatorId: character.id,
        sequenceId: sequence.id,
        sortOrder,
        index: sequence.index,
        name: sequence.name,
        description: sequence.description,
      }))
    )
  }

  if (character.passives.length > 0) {
    await db.insert(resonatorPassives).values(
      character.passives.map((passive, sortOrder) => ({
        resonatorId: character.id,
        passiveId: passive.id,
        sortOrder,
        title: passive.title,
        valueNumber: numberConverter({ input: passive.description }),
        icon: passive.icon,
      }))
    )
  }
}

export async function readCharacter(
  db: AppDb,
  id: number
): Promise<EncoreCharacterDetail | null> {
  const row = await db.query.resonators.findFirst({
    where: { id },
    with: {
      media: { orderBy: { sortOrder: "asc" } },
      tags: { orderBy: { sortOrder: "asc" } },
      properties: {
        orderBy: { sortOrder: "asc" },
        with: { growth: { orderBy: { sortOrder: "asc" } } },
      },
      skills: { orderBy: { sortOrder: "asc" } },
      sequences: { orderBy: { sortOrder: "asc" } },
      passives: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!row) return null

  const images = {
    card: row.card,
    icon: row.icon,
    iconLarge: row.iconLarge,
    circle: row.circle,
    portrait: row.portrait,
  }

  for (const media of row.media) {
    if (isResonatorMediaKind(media.kind)) {
      images[media.kind] = media.url
    }
  }

  return {
    id: row.id,
    name: row.name,
    introduction: row.introduction,
    rarity: row.rarity,
    element: row.element,
    weaponType: row.weaponType,
    icon: row.icon,
    images,
    tags: row.tags.map((tag) => ({
      name: tag.name,
      description: tag.description,
      color: tag.color,
      icon: tag.icon,
    })),
    properties: row.properties.map((property) => ({
      name: property.name,
      icon: property.icon,
      baseValue: property.baseValue,
      growth: property.growth.map((entry) => ({
        level: entry.level,
        value: growthValueFromRow(entry),
      })),
    })),
    skills: row.skills.map((skill) => ({
      id: skill.skillId,
      type: skill.type,
      name: skill.name,
      description: skill.description,
      icon: skill.icon,
      media: skill.media,
      attributes: [],
      consumes: [],
      damage: [],
    })),
    sequences: row.sequences.map((sequence) => ({
      id: sequence.sequenceId,
      index: sequence.index,
      name: sequence.name,
      description: sequence.description,
    })),
    passives: row.passives.map((passive) => ({
      id: passive.passiveId,
      title: passive.title,
      description: String(passive.valueNumber),
      icon: passive.icon,
      consume: [],
    })),
    breaches: [],
  }
}

export async function readCharacters(db: AppDb): Promise<ResonatorRow[]> {
  return db.query.resonators.findMany({ orderBy: { id: "asc" } })
}

/**
 * Refinement stats already authored for a weapon, keyed by rank.
 *
 * `saveWeapon` deletes and re-inserts the whole document and the API never
 * carries these rows, so they are read first and restored for every rank that
 * still exists. Without this, a re-sync would wipe builder-critical data.
 */
async function refinementStatsByRank(
  db: AppDb,
  weaponId: number
): Promise<Map<number, EncoreWeaponRefinementStat[]>> {
  const rows = await db.query.weaponRefinements.findMany({
    where: { weaponId },
    with: { stats: { orderBy: { sortOrder: "asc" } } },
  })

  return new Map(
    rows.map((row) => [
      row.sortOrder,
      row.stats.map((stat) => ({
        name: stat.statName,
        value: stat.statNumber,
      })),
    ])
  )
}

export async function saveWeapon(
  db: AppDb,
  weapon: EncoreWeaponDetail
): Promise<void> {
  const storedStats = await refinementStatsByRank(db, weapon.id)

  await db.delete(weapons).where(eq(weapons.id, weapon.id))

  await db.insert(weapons).values({
    id: weapon.id,
    name: weapon.name,
    rarity: weapon.rarity,
    type: weapon.type,
    typeName: weapon.typeName,
    icon: weapon.icon,
    description: weapon.description,
  })

  if (weapon.properties.length > 0) {
    const inserted = (await db
      .insert(weaponProperties)
      .values(
        weapon.properties.map((property, sortOrder) => ({
          weaponId: weapon.id,
          sortOrder,
          name: property.name,
          icon: property.icon,
          baseValue: property.baseValue,
        }))
      )
      .returning({
        id: weaponProperties.id,
        sortOrder: weaponProperties.sortOrder,
      })) as InsertedId[]

    const growth = inserted.flatMap((row) =>
      weapon.properties[row.sortOrder].growth.map((entry, sortOrder) => ({
        propertyId: row.id,
        sortOrder,
        level: entry.level,
        ...growthValueColumns(entry.value),
      }))
    )

    if (growth.length > 0) {
      await db.insert(weaponPropertyGrowth).values(growth)
    }
  }

  if (weapon.refinements.length > 0) {
    const inserted = (await db
      .insert(weaponRefinements)
      .values(
        weapon.refinements.map((refinement) => ({
          weaponId: weapon.id,
          sortOrder: refinement.rank,
          name: refinement.name,
          effect: refinement.effect,
        }))
      )
      .returning({
        id: weaponRefinements.id,
        sortOrder: weaponRefinements.sortOrder,
      })) as InsertedId[]

    const stats = inserted.flatMap((row) => {
      const provided = weapon.refinements.find(
        (refinement) => refinement.rank === row.sortOrder
      )?.stats
      const source =
        provided && provided.length > 0
          ? provided
          : (storedStats.get(row.sortOrder) ?? [])

      return source.map((stat, sortOrder) => ({
        refinementId: row.id,
        sortOrder,
        statName: stat.name,
        statNumber: stat.value,
      }))
    })

    if (stats.length > 0) {
      await db.insert(weaponRefinementStats).values(stats)
    }
  }
}

export async function readWeapon(
  db: AppDb,
  id: number
): Promise<EncoreWeaponDetail | null> {
  const row = await db.query.weapons.findFirst({
    where: { id },
    with: {
      properties: {
        orderBy: { sortOrder: "asc" },
        with: { growth: { orderBy: { sortOrder: "asc" } } },
      },
      refinements: {
        orderBy: { sortOrder: "asc" },
        with: { stats: { orderBy: { sortOrder: "asc" } } },
      },
    },
  })

  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    rarity: row.rarity,
    type: row.type,
    typeName: row.typeName,
    icon: row.icon,
    description: row.description,
    properties: row.properties.map((property) => ({
      name: property.name,
      icon: property.icon,
      baseValue: property.baseValue,
      growth: property.growth.map((entry) => ({
        level: entry.level,
        value: growthValueFromRow(entry),
      })),
    })),
    refinements: row.refinements.map((refinement) => ({
      rank: refinement.sortOrder,
      name: refinement.name,
      effect: refinement.effect,
      stats: refinement.stats.map((stat) => ({
        name: stat.statName,
        value: stat.statNumber,
      })),
    })),
  }
}

export async function readWeapons(db: AppDb): Promise<EncoreWeaponSummary[]> {
  const rows = await db.query.weapons.findMany({ orderBy: { id: "asc" } })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    rarity: row.rarity,
    type: row.type,
    typeName: row.typeName,
    icon: row.icon,
  }))
}

export async function saveEcho(
  db: AppDb,
  echo: EncoreEchoDetail
): Promise<void> {
  await db.delete(echoes).where(eq(echoes.id, echo.id))

  await db.insert(echoes).values({
    id: echo.id,
    name: echo.name,
    class: echo.class,
    cost: echo.cost,
    icon: echo.icon,
  })

  if (echo.sets.length > 0) {
    await db.insert(echoSets).values(
      echo.sets.map((set, sortOrder) => ({
        echoId: echo.id,
        sortOrder,
        setId: set.id,
        name: set.name,
        icon: set.icon,
      }))
    )
  }

  if (echo.skill) {
    await db.insert(echoSkills).values({
      echoId: echo.id,
      description: echo.skill.description,
      simpleDescription: echo.skill.simpleDescription,
      icon: echo.skill.icon,
    })
  }
}

export async function readEcho(
  db: AppDb,
  id: number
): Promise<EncoreEchoDetail | null> {
  const row = await db.query.echoes.findFirst({
    where: { id },
    with: {
      sets: {
        orderBy: { sortOrder: "asc" },
        with: { sonataEffects: { orderBy: { pieces: "asc" } } },
      },
      skill: true,
    },
  })

  if (!row) return null

  const sets: EncoreEchoSet[] = row.sets.map((set) => ({
    id: set.setId,
    name: set.name,
    icon: set.icon,
    effects: set.sonataEffects.map((effect) => ({
      key: effect.pieces,
      description: effect.description,
    })),
  }))

  return {
    id: row.id,
    name: row.name,
    class: row.class,
    cost: row.cost,
    icon: row.icon,
    sets,
    skill: row.skill
      ? {
          description: row.skill.description,
          simpleDescription: row.skill.simpleDescription,
          icon: row.skill.icon,
        }
      : null,
  }
}

export async function readEchoes(db: AppDb): Promise<EncoreEchoSummary[]> {
  const rows = await db.query.echoes.findMany({
    orderBy: { id: "asc" },
    with: {
      sets: {
        orderBy: { sortOrder: "asc" },
        with: { sonataEffects: { orderBy: { pieces: "asc" } } },
      },
    },
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    class: row.class,
    cost: row.cost,
    icon: row.icon,
    sets: row.sets.map((set) => ({
      id: set.setId,
      name: set.name,
      icon: set.icon,
      effects: set.sonataEffects.map((effect) => ({
        key: effect.pieces,
        description: effect.description,
      })),
    })),
  }))
}
