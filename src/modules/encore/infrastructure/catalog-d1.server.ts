import { eq } from "drizzle-orm"
import type { AppDb } from "@/db/create"
import {
  echoSetEffects,
  echoSets,
  echoSkills,
  echoes,
  resonatorBreaches,
  resonatorPassiveItems,
  resonatorPassives,
  resonatorProperties,
  resonatorPropertyGrowth,
  resonatorSequences,
  resonatorSkillAttributes,
  resonatorSkills,
  resonatorTags,
  resonators,
  weaponBreaches,
  weaponProperties,
  weaponPropertyGrowth,
  weapons,
} from "@/db/schema"
import type {
  EncoreCharacterDetail,
  EncoreCharacterSummary,
} from "../domain/character"
import type {
  EncoreEchoDetail,
  EncoreEchoSet,
  EncoreEchoSummary,
} from "../domain/echo"
import type { EncoreWeaponDetail, EncoreWeaponSummary } from "../domain/weapon"

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
    nickname: character.nickname,
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
      .insert(resonatorProperties)
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
        id: resonatorProperties.id,
        sortOrder: resonatorProperties.sortOrder,
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
    const inserted = (await db
      .insert(resonatorSkills)
      .values(
        character.skills.map((skill, sortOrder) => ({
          resonatorId: character.id,
          skillId: skill.id,
          sortOrder,
          type: skill.type,
          name: skill.name,
          description: skill.description,
          icon: skill.icon,
          media: skill.media,
          consumes: skill.consumes,
          damage: skill.damage,
        }))
      )
      .returning({
        id: resonatorSkills.id,
        sortOrder: resonatorSkills.sortOrder,
      })) as InsertedId[]

    const attributes = inserted.flatMap((row) =>
      character.skills[row.sortOrder].attributes.map(
        (attribute, sortOrder) => ({
          skillId: row.id,
          sortOrder,
          attributeId: attribute.id,
          name: attribute.name,
          values: attribute.values,
          description: attribute.description ?? null,
        })
      )
    )

    if (attributes.length > 0) {
      await db.insert(resonatorSkillAttributes).values(attributes)
    }
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
    const inserted = (await db
      .insert(resonatorPassives)
      .values(
        character.passives.map((passive, sortOrder) => ({
          resonatorId: character.id,
          passiveId: passive.id,
          sortOrder,
          title: passive.title,
          description: passive.description,
          icon: passive.icon,
        }))
      )
      .returning({
        id: resonatorPassives.id,
        sortOrder: resonatorPassives.sortOrder,
      })) as InsertedId[]

    const consume = inserted.flatMap((row) =>
      character.passives[row.sortOrder].consume.map((item, sortOrder) => ({
        passiveId: row.id,
        sortOrder,
        key: item.key,
        value: item.value,
        icon: item.icon,
        quality: item.quality,
      }))
    )

    if (consume.length > 0) {
      await db.insert(resonatorPassiveItems).values(consume)
    }
  }

  if (character.breaches.length > 0) {
    await db.insert(resonatorBreaches).values(
      character.breaches.map((breach, sortOrder) => ({
        resonatorId: character.id,
        breachId: breach.id,
        sortOrder,
        level: breach.level,
        maxLevel: breach.maxLevel,
        items: breach.items,
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
      tags: { orderBy: { sortOrder: "asc" } },
      properties: {
        orderBy: { sortOrder: "asc" },
        with: { growth: { orderBy: { sortOrder: "asc" } } },
      },
      skills: {
        orderBy: { sortOrder: "asc" },
        with: { attributes: { orderBy: { sortOrder: "asc" } } },
      },
      sequences: { orderBy: { sortOrder: "asc" } },
      passives: {
        orderBy: { sortOrder: "asc" },
        with: { consume: { orderBy: { sortOrder: "asc" } } },
      },
      breaches: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname,
    introduction: row.introduction,
    rarity: row.rarity,
    element: row.element,
    weaponType: row.weaponType,
    icon: row.icon,
    images: {
      card: row.card,
      icon: row.icon,
      iconLarge: row.iconLarge,
      circle: row.circle,
      portrait: row.portrait,
    },
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
      attributes: skill.attributes.map((attribute) => ({
        id: attribute.attributeId,
        name: attribute.name,
        values: attribute.values,
        description: attribute.description ?? undefined,
      })),
      consumes: skill.consumes,
      damage: skill.damage,
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
      description: passive.description,
      icon: passive.icon,
      consume: passive.consume.map((item) => ({
        key: item.key,
        value: item.value,
        icon: item.icon,
        quality: item.quality,
      })),
    })),
    breaches: row.breaches.map((breach) => ({
      id: breach.breachId,
      level: breach.level,
      maxLevel: breach.maxLevel,
      items: breach.items,
    })),
  }
}

export async function readCharacters(
  db: AppDb
): Promise<EncoreCharacterSummary[]> {
  const rows = await db.query.resonators.findMany({
    orderBy: { id: "asc" },
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    rarity: row.rarity,
    element: row.element,
    weaponType: row.weaponType,
    icon: row.icon,
  }))
}

export async function saveWeapon(
  db: AppDb,
  weapon: EncoreWeaponDetail
): Promise<void> {
  await db.delete(weapons).where(eq(weapons.id, weapon.id))

  await db.insert(weapons).values({
    id: weapon.id,
    name: weapon.name,
    rarity: weapon.rarity,
    type: weapon.type,
    typeName: weapon.typeName,
    icon: weapon.icon,
    description: weapon.description,
    effect: weapon.effect,
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

  if (weapon.breaches.length > 0) {
    await db.insert(weaponBreaches).values(
      weapon.breaches.map((breach, sortOrder) => ({
        weaponId: weapon.id,
        breachId: breach.id,
        sortOrder,
        level: breach.level,
        levelLimit: breach.levelLimit,
        items: breach.items,
      }))
    )
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
      breaches: { orderBy: { sortOrder: "asc" } },
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
    effect: row.effect,
    properties: row.properties.map((property) => ({
      name: property.name,
      icon: property.icon,
      baseValue: property.baseValue,
      growth: property.growth.map((entry) => ({
        level: entry.level,
        value: growthValueFromRow(entry),
      })),
    })),
    breaches: row.breaches.map((breach) => ({
      id: breach.breachId,
      level: breach.level,
      levelLimit: breach.levelLimit,
      items: breach.items,
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
    rarity: echo.rarity,
    element: echo.element,
    icon: echo.icon,
    description: echo.description,
  })

  if (echo.sets.length > 0) {
    const inserted = (await db
      .insert(echoSets)
      .values(
        echo.sets.map((set, sortOrder) => ({
          echoId: echo.id,
          sortOrder,
          setId: set.id,
          name: set.name,
          icon: set.icon,
        }))
      )
      .returning({
        id: echoSets.id,
        sortOrder: echoSets.sortOrder,
      })) as InsertedId[]

    const effects = inserted.flatMap((row) =>
      echo.sets[row.sortOrder].effects.map((effect, sortOrder) => ({
        setId: row.id,
        sortOrder,
        key: effect.key,
        description: effect.description,
      }))
    )

    if (effects.length > 0) {
      await db.insert(echoSetEffects).values(effects)
    }
  }

  if (echo.skill) {
    await db.insert(echoSkills).values({
      echoId: echo.id,
      description: echo.skill.description,
      cooldown: echo.skill.cooldown,
      damage: echo.skill.damage,
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
        with: { effects: { orderBy: { sortOrder: "asc" } } },
      },
      skill: true,
    },
  })

  if (!row) return null

  const sets: EncoreEchoSet[] = row.sets.map((set) => ({
    id: set.setId,
    name: set.name,
    icon: set.icon,
    effects: set.effects.map((effect) => ({
      key: effect.key,
      description: effect.description,
    })),
  }))

  return {
    id: row.id,
    name: row.name,
    rarity: row.rarity,
    element: row.element,
    icon: row.icon,
    description: row.description,
    sets,
    skill: row.skill
      ? {
          description: row.skill.description,
          cooldown: row.skill.cooldown,
          damage: row.skill.damage,
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
        with: { effects: { orderBy: { sortOrder: "asc" } } },
      },
    },
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    rarity: row.rarity,
    element: row.element,
    icon: row.icon,
    sets: row.sets.map((set) => ({
      id: set.setId,
      name: set.name,
      icon: set.icon,
      effects: set.effects.map((effect) => ({
        key: effect.key,
        description: effect.description,
      })),
    })),
  }))
}
