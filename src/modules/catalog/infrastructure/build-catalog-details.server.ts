import type { AppDb } from "@db/create"

/** Reads a canonical resonator and its ordered catalog relations. */
export function readCatalogCharacterDetail(db: AppDb, id: number) {
  return db.query.resonators.findFirst({
    where: { id },
    with: {
      media: { orderBy: { sortOrder: "asc" } },
      tags: { orderBy: { sortOrder: "asc" } },
      bestWeapons: {
        orderBy: { sortOrder: "asc" },
        with: { weapon: true },
      },
      bestSets: {
        orderBy: { sortOrder: "asc" },
        with: { sonata: true },
      },
      properties: {
        orderBy: { sortOrder: "asc" },
        with: { growth: { orderBy: { sortOrder: "asc" } } },
      },
      skills: { orderBy: { sortOrder: "asc" } },
      sequences: { orderBy: { sortOrder: "asc" } },
      passives: { orderBy: { sortOrder: "asc" } },
    },
  })
}

/** Reads the canonical weapons and their calculation data for a set of IDs. */
export function readCatalogWeaponDetails(db: AppDb, ids: number[]) {
  return db.query.weapons.findMany({
    where: { id: { in: ids } },
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
}

/** Reads the canonical echoes, sonata links, and static bonuses. */
export function readCatalogEchoDetails(db: AppDb, ids: number[]) {
  return db.query.echoes.findMany({
    where: { id: { in: ids } },
    with: {
      sets: {
        orderBy: { sortOrder: "asc" },
        with: { sonata: true, sonataEffects: true },
      },
      skill: true,
      skillBonuses: { orderBy: { sortOrder: "asc" } },
    },
  })
}

/** Reads canonical sonatas and their effects in display order. */
export function readCatalogSonataDetails(db: AppDb, ids?: number[]) {
  return db.query.sonataSets.findMany({
    ...(ids && { where: { id: { in: ids } } }),
    orderBy: { id: "asc" },
    with: { effects: { orderBy: { sortOrder: "asc" } } },
  })
}
