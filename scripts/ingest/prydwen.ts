/**
 * Prydwen character page reader (scraped with a browser user agent).
 *
 * Prydwen is the source for the recommendations Encore does not carry: best
 * weapons, best sonata sets and the main echo options. The percentages are
 * performance ratings and are intentionally dropped; only the order, the
 * weapon refinement rank and the names are kept.
 */

const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"

const REQUEST_TIMEOUT_MS = 20_000

export const PRYDWEN_BASE = "https://www.prydwen.gg/wuthering-waves"

/** One recommended weapon, in Prydwen's priority order. */
export interface PrydwenWeapon {
  name: string
  rank: number
}

/** One recommended sonata set, in Prydwen's priority order. */
export interface PrydwenSet {
  /** Raw Prydwen set name; mapped to Spanish sonata rows by the matcher. */
  name: string
  /** Prydwen's ordinal on ordinal-style pages, when present. */
  rank?: number
  mainEchoes: string[]
}

export interface PrydwenCharacter {
  slug: string
  weapons: PrydwenWeapon[]
  sets: PrydwenSet[]
}

/** Minimal HTML → line list conversion for section slicing. */
export function htmlToLines(html: string): string[] {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")

  return decodeEntities(stripped)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
}

function decodeEntities(text: string): string {
  return text.replace(
    /&(amp|lt|gt|quot|#x27|#39|nbsp);/g,
    (match) => ENTITIES[match] ?? match
  )
}

const PERCENT_LINE = /^\d+(?:\.\d+)?%$/
const WEAPON_ENTRY = /^(.+?)\s+\(R\s*(\d)\s*\)$/
const NUMBER_LINE = /^\d+$/
const MAIN_ECHO_MARKER = "Below you can find Main Echo options:"
const SET_SECTION_HEADINGS = new Set(["Best Echo Sets", "Special Echo Sets"])
const COMBINED_MARKER = "Best combined with your choice of:"

/** Whether a line is a numbered rank before a weapon entry. */
function isRankNumber(section: string[], index: number): boolean {
  const line = section[index]

  if (!NUMBER_LINE.test(line)) return false

  return WEAPON_ENTRY.test(section[index + 1] ?? "")
}

/**
 * Weapon recommendations between the Best Weapons and Best Echo Sets sections.
 *
 * Two layouts exist: newer pages put a percentage before each entry, older ones
 * put an ordinal rank before it. Both are accepted.
 */
export function parseBestWeapons(lines: string[]): PrydwenWeapon[] {
  const section = sliceSection(lines, "Best Weapons", "Best Echo Sets")
  const weapons: PrydwenWeapon[] = []

  for (let index = 0; index < section.length; index += 1) {
    const isPercentEntry =
      PERCENT_LINE.test(section[index]) &&
      WEAPON_ENTRY.test(section[index + 1] ?? "")
    const isRankedEntry =
      isRankNumber(section, index) && section[index - 1] !== undefined

    if (!isPercentEntry && !isRankedEntry) continue

    const entry = WEAPON_ENTRY.exec(section[index + 1] ?? "")

    if (!entry) continue

    const name = entry[1].trim()

    if (name.length === 0) continue

    weapons.push({ name, rank: Number(entry[2]) })
  }

  return dedupeWeapons(weapons)
}

function dedupeWeapons(weapons: PrydwenWeapon[]): PrydwenWeapon[] {
  const seen = new Set<string>()

  return weapons.filter((weapon) => {
    if (seen.has(weapon.name)) return false

    seen.add(weapon.name)
    return true
  })
}

/** Sonata sets from every heading between Best Echo Sets and Best Echo Stats. */
export function parseBestSets(lines: string[]): PrydwenSet[] {
  const start = lastIndexOfLine(lines, "Best Echo Sets")

  if (start === -1) return []

  const end = firstIndexOfLine(lines, "Best Echo Stats", start)

  if (end === -1) return []

  const section = lines.slice(start, end)
  const sets: PrydwenSet[] = []

  for (let index = 0; index < section.length; index += 1) {
    const next = section[index + 1]

    if (!next) continue

    const isPercentSet =
      PERCENT_LINE.test(section[index]) && !WEAPON_ENTRY.test(next)
    const isHeadingSet = SET_SECTION_HEADINGS.has(section[index])
    const isOrdinalSet =
      NUMBER_LINE.test(section[index]) &&
      !isRankNumber(section, index) &&
      !NUMBER_LINE.test(next)

    if (!isPercentSet && !isHeadingSet && !isOrdinalSet) continue
    if (isHeadingSet && PERCENT_LINE.test(next)) {
      const percentName = section[index + 2]

      if (percentName && !WEAPON_ENTRY.test(percentName)) {
        const result = collectSet(section, index + 1, sets)

        if (result) index = result.nextIndex

        continue
      }
    }

    const name = next.trim()

    if (WEAPON_ENTRY.test(name) || name === MAIN_ECHO_MARKER) continue
    if (name.startsWith("(")) continue
    if (/^\d+$/.test(name)) continue
    if (sets.some((set) => set.name === name)) continue

    const collected = collectSet(section, index, sets)

    if (collected) index = collected.nextIndex
  }

  return sets
}

/** Collects one set entry starting at `index`; returns the next scan index. */
function collectSet(
  section: string[],
  index: number,
  sets: PrydwenSet[]
): { nextIndex: number } | null {
  const isPercent = PERCENT_LINE.test(section[index])
  const name = section[index + 1]?.trim()

  if (!name) return null
  if (WEAPON_ENTRY.test(name) || name === MAIN_ECHO_MARKER) return null
  if (name.startsWith("(") || /^\d+$/.test(name)) return null
  if (sets.some((set) => set.name === name)) return null

  const ordinal = NUMBER_LINE.test(section[index])
    ? Number(section[index])
    : undefined
  const mainEchoes: string[] = []
  let cursor = index + 2

  while (cursor < section.length) {
    const line = section[cursor]

    if (PERCENT_LINE.test(line)) break
    if (SET_SECTION_HEADINGS.has(line)) break
    if (line === COMBINED_MARKER) {
      cursor = skipCombinedBlock(section, cursor)
      continue
    }

    if (line === MAIN_ECHO_MARKER) {
      cursor += 1

      while (
        cursor < section.length &&
        !PERCENT_LINE.test(section[cursor]) &&
        !SET_SECTION_HEADINGS.has(section[cursor])
      ) {
        if (
          !section[cursor].startsWith("-") &&
          section[cursor + 1]?.startsWith("-")
        ) {
          mainEchoes.push(section[cursor])
        }

        cursor += 1
      }

      continue
    }

    cursor += 1
  }

  sets.push({
    name,
    mainEchoes,
    ...(ordinal !== undefined && !isPercent ? { rank: ordinal } : {}),
  })

  return { nextIndex: cursor - 2 }
}

/** Skips a "2P <set> <echo>" recommendation block. */
function skipCombinedBlock(section: string[], cursor: number): number {
  let index = cursor

  while (index < section.length) {
    const line = section[index]

    if (PERCENT_LINE.test(line)) return index
    if (SET_SECTION_HEADINGS.has(line)) return index
    if (line === MAIN_ECHO_MARKER) return index

    index += 1
  }

  return index
}

function sliceSection(lines: string[], start: string, end: string): string[] {
  const startIndex = lastIndexOfLine(lines, start, firstIndexOfLine(lines, end))

  if (startIndex === -1) return []

  const endIndex = firstIndexOfLine(lines, end, startIndex)

  return endIndex === -1 ? [] : lines.slice(startIndex, endIndex)
}

function firstIndexOfLine(lines: string[], value: string, from = 0): number {
  for (let index = from; index < lines.length; index += 1) {
    if (lines[index] === value) return index
  }

  return -1
}

function lastIndexOfLine(
  lines: string[],
  value: string,
  before?: number
): number {
  const limit = before ?? lines.length

  for (let index = Math.min(limit, lines.length) - 1; index >= 0; index -= 1) {
    if (lines[index] === value) return index
  }

  return -1
}

/** Parses one already-fetched character page. */
export function parseCharacterPage(
  slug: string,
  html: string
): PrydwenCharacter {
  const lines = htmlToLines(html)
  const weapons = parseBestWeapons(lines)
  const sets = parseBestSets(lines)

  if (weapons.length === 0) {
    throw new Error(`No best weapons found for ${slug}`)
  }

  return { slug, weapons, sets: sets.filter((set) => !/^\d+$/.test(set.name)) }
}

/** Fetches and parses one character page. */
export async function fetchPrydwenCharacter(
  slug: string
): Promise<PrydwenCharacter> {
  const response = await fetch(`${PRYDWEN_BASE}/characters/${slug}`, {
    headers: { "user-agent": BROWSER_UA },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Prydwen ${response.status} for ${slug}`)
  }

  return parseCharacterPage(slug, await response.text())
}

/** Fetches with one retry after a pause, for transient blocks and 5xx. */
export async function fetchPrydwenCharacterWithRetry(
  slug: string,
  pauseMs = 2_000
): Promise<PrydwenCharacter> {
  try {
    return await fetchPrydwenCharacter(slug)
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, pauseMs))

    return fetchPrydwenCharacter(slug)
  }
}
