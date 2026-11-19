import type { PrydwenCharacter } from "./prydwen"
import { fetchEncoreJson } from "@encore/infrastructure/http.server"

/**
 * Name matching between Prydwen (English) and the Encore catalog.
 *
 * Prydwen recommends by English name; the catalog stores the Spanish ones. The
 * English endpoints provide the stable join, and slugs resolve a Prydwen page
 * to its Encore id without touching the Spanish copy.
 */

interface RawName {
  Id: number
  Name: string
}

const SLUG_TO_EN_NAME: Record<string, string> = {
  "the-shorekeeper": "Shorekeeper",
  "rover-aero": "Rover: Aero",
  "rover-spectro": "Rover: Spectro",
  "rover-havoc": "Rover: Havoc",
  "rover-electro": "Rover: Electro",
  "yangyang-xuanling": "Yangyang: Xuanling",
}

const NORMALIZED_OVERRIDES: Record<string, string> = {
  "rectifier#25": "Rectifier#25",
}

function normalize(name: string): string {
  const lower = name.trim().toLowerCase().replace(/\s+/g, " ")

  return NORMALIZED_OVERRIDES[lower] ?? lower
}

function slugToName(slug: string): string {
  if (SLUG_TO_EN_NAME[slug]) return SLUG_TO_EN_NAME[slug]

  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Encore ids by normalized English name. */
export interface NameIndex {
  characters: Map<string, number>
  weapons: Map<string, number>
  echoes: Map<string, number>
  /** English name by Encore id, for report messages. */
  characterNames: Map<number, string>
  /** Sonata set id by normalized English name. */
  sonatas: Map<string, number>
}

async function readList<T>(path: string): Promise<T[]> {
  const payload = await fetchEncoreJson<Record<string, T[]>>(path)

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) return value
  }

  return []
}

function indexBy(entries: RawName[]): Map<string, number> {
  const index = new Map<string, number>()

  for (const entry of entries) {
    const key = normalize(entry.Name)

    if (!index.has(key)) index.set(key, entry.Id)
  }

  return index
}

interface RawEchoListEntry {
  Id: number
  Type?: string
  FetterGroups?: { Id: number; Name: string }[]
}

/** Sonata id by English name, from the first echo carrying each set. */
async function readSonataIndex(): Promise<Map<string, number>> {
  const echoes = (await readList<RawEchoListEntry>("../en/echo?page=1")).filter(
    (echo) => echo.Type === "Echo"
  )
  const carriers = new Map<number, string>()

  for (const echo of echoes) {
    for (const group of echo.FetterGroups ?? []) {
      if (!carriers.has(group.Id)) carriers.set(group.Id, group.Name)
    }
  }

  const index = new Map<string, number>()

  for (const [id, name] of carriers) {
    index.set(normalize(name), id)
  }

  return index
}

/** Builds every name index from the English Encore endpoints. */
export async function buildNameIndex(): Promise<NameIndex> {
  const [characters, weapons, echoes, sonatas] = await Promise.all([
    readList<RawName>("../en/character?page=1"),
    readList<RawName>("../en/weapon"),
    readList<RawName>("../en/echo?page=1"),
    readSonataIndex(),
  ])

  return {
    characters: indexBy(characters),
    weapons: indexBy(weapons),
    echoes: indexBy(echoes),
    characterNames: new Map(
      characters.map((character) => [character.Id, character.Name])
    ),
    sonatas,
  }
}

/** Encore character id behind a Prydwen slug, or `null` when unknown. */
export function matchCharacter(index: NameIndex, slug: string): number | null {
  const name = slugToName(slug)

  return index.characters.get(normalize(name)) ?? null
}

/** Lookup result for one Prydwen page. */
export interface MatchedCharacter {
  characterId: number | null
  weapons: { name: string; rank: number; id: number | null }[]
  sets: { name: string; mainEchoes: { name: string; id: number | null }[] }[]
}

/** Resolves every Prydwen name in one page to Encore ids. */
export function matchPrydwenPage(
  index: NameIndex,
  page: PrydwenCharacter
): MatchedCharacter {
  return {
    characterId: matchCharacter(index, page.slug),
    weapons: page.weapons.map((weapon) => ({
      name: weapon.name,
      rank: weapon.rank,
      id: index.weapons.get(normalize(weapon.name)) ?? null,
    })),
    sets: page.sets.map((set) => ({
      name: set.name,
      mainEchoes: set.mainEchoes.map((echo) => ({
        name: echo,
        id: index.echoes.get(normalize(echo)) ?? null,
      })),
    })),
  }
}

/**
 * Prydwen sonata renames the API does not know.
 *
 * Prydwen renamed "Lingering Tunes" to "Endless Resonance"; Encore still
 * publishes the old name, so the alias keeps the set matched on re-import.
 */
export const PRYDWEN_SONATA_ALIASES: Record<string, string> = {
  "endless resonance": "lingering tunes",
}

/** Encore character ids of each rover pair, first id first. */
export const ROVER_ID_PAIRS: [number, number][] = [
  [1406, 1408],
  [1501, 1502],
  [1604, 1605],
  [1309, 1310],
]

/** Whether two character ids are the same rover published twice. */
export function isRoverPair(left: number, right: number): boolean {
  return ROVER_ID_PAIRS.some(
    ([first, second]) =>
      (left === first && right === second) ||
      (left === second && right === first)
  )
}

/** Sonata set id of a Prydwen set name, honoring renames. */
export function matchSonataId(
  index: NameIndex,
  prydwenName: string
): number | undefined {
  const key = normalize(prydwenName)
  const aliased = PRYDWEN_SONATA_ALIASES[key] ?? key

  return index.sonatas.get(aliased)
}

/** Maps English sonata names to Spanish catalog rows by normalized comparison. */
export function mapSonataNames(
  englishNames: Map<string, number>,
  spanishRows: { id: number; name: string }[]
): Map<string, number> {
  const spanishByNormalized = new Map<string, number>()

  for (const row of spanishRows) {
    spanishByNormalized.set(normalize(row.name), row.id)
  }

  const result = new Map<string, number>()

  for (const englishName of englishNames.keys()) {
    const spanishId = spanishByNormalized.get(normalize(englishName))

    if (spanishId !== undefined) result.set(englishName, spanishId)
  }

  return result
}
