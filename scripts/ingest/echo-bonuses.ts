import type { StatId } from "@catalog/application/stats/stats"
import { REFINEMENT_STAT_ALIASES } from "./refinement-stats"

/**
 * Echo skill bonus extraction from Encore echo prose (Spanish).
 *
 * The echo skill text mixes a summons description (damage, ignored) with the
 * static bonuses the builder can add. The curation rule from the catalog:
 *
 * - Main-slot statics ("…equipado en la primera ranura, la Bonif. de Daño
 *   Gelio del portador aumenta un 12.00% y la Bonif. de Daño Aero un
 *   12.00%") become `none` rows with `requires_main_slot = 1` that the
 *   builder sums. Chained stats inherit the same condition.
 * - Bearer-specific statics ("Cuando Aemeath lo equipa en la primera ranura,
 *   su Bonif. de daño de Liberación aumenta un 25.00%") become `resonator`
 *   rows with the bearer's character id.
 * - Everything windowed ("durante X s"), team-wide ("del equipo", "todos los
 *   personajes") or for the next character ("siguiente personaje") is
 *   combat-only: `combat` rows for display, never summed.
 * - Cost-1 echoes never carry special bonuses: pure damage descriptions.
 *
 * The scanner works per stat occurrence: it finds every alias key followed by
 * a percentage, then decides the condition from the sentence around it.
 */

/** One parsed bonus, ready to become an `echo_skill_bonuses` row. */
export interface ParsedEchoBonus {
  statId: StatId
  value: number
  requiresMainSlot: boolean
  condition: "none" | "resonator" | "element" | "combat"
  conditionValue: string | null
  /** Named bearer when `conditionValue` still needs an id lookup. */
  bearer?: string
}

/** Rovers are published twice; both ids receive the same bonus row. */
const ROVER_IDS: Record<string, string[]> = {
  "errante: aero": ["1406", "1408"],
  "errante: espectro": ["1501", "1502"],
  "errante: destrucción": ["1604", "1605"],
  "errante: electro": ["1309", "1310"],
}

/** Sentence markers that demote a stat to combat-only. */
const COMBAT_MARKERS = [
  "durante",
  "siguiente personaje",
  "del equipo",
  "todos los personajes",
  "acumula",
  "mientras",
  "tras",
  "después de",
  "despues de",
]

/** Markers that the stat is bound to the echo's main slot. */
const MAIN_SLOT_MARKERS = ["primera ranura", "ranura principal"]

/** Alias keys sorted longest-first so the most specific wins. */
const STAT_KEYS = Object.keys(REFINEMENT_STAT_ALIASES).sort(
  (left, right) => right.length - left.length
)

/** Occurrence of one stat mention inside the description. */
interface StatOccurrence {
  key: string
  statId: StatId
  value: number
  /** Clause containing the mention, lowercase, for condition checks. */
  context: string
}

function statIdFor(key: string): StatId | null {
  return REFINEMENT_STAT_ALIASES[key.toLowerCase()] ?? null
}

/**
 * Splits the description into clause spans.
 *
 * A clause break is a period followed by an uppercase letter (a real sentence
 * end — "Bonif." and "Regen." abbreviations are followed by lowercase), a
 * `<br>` or the "REU:" cooldown marker.
 */
/**
 * Splits the description into clause spans, protecting alias keys.
 *
 * A clause break is a period followed by an uppercase letter or the "REU:"
 * cooldown marker — but only when the period is not part of an alias key
 * ("Prob. CRIT" would otherwise split the key in two). Alias positions are
 * located first and any separator inside them is discarded.
 */
function clauses(
  description: string
): { start: number; end: number; text: string }[] {
  const text = description.replace(/\s+/g, " ")
  const lower = text.toLowerCase()

  /** Ranges covered by any alias key occurrence. */
  const protectedRanges: { start: number; end: number }[] = []

  for (const key of STAT_KEYS) {
    let searchStart = 0

    while (true) {
      const index = lower.indexOf(key, searchStart)

      if (index === -1) break

      searchStart = index + key.length
      protectedRanges.push({ start: index, end: index + key.length })
    }
  }

  const separators = [
    ...text.matchAll(/\.\s*[A-ZÁÉÍÓÚÑ]/g),
    ...text.matchAll(/REU:/g),
  ]
    .map((match) => match.index!)
    .filter((index) =>
      protectedRanges.every(
        (range) => index < range.start || index >= range.end
      )
    )

  const bounds = [...new Set(separators)].sort((left, right) => left - right)
  const spans: { start: number; end: number; text: string }[] = []
  let start = 0

  for (const bound of [...bounds, text.length]) {
    if (bound <= start) continue

    const span = { start, end: bound, text: text.slice(start, bound) }

    if (span.text.trim().length > 0) spans.push(span)

    start = bound + 1
  }

  return spans
}

/**
 * Finds every stat occurrence: an alias key followed by a percentage within a
 * short window, tolerating "en un X%", "un X%", "de un X%" and a "del
 * portador" connector between key and verb.
 */
function findOccurrences(description: string): StatOccurrence[] {
  const occurrences: StatOccurrence[] = []
  const text = description
    .replace(/<br\s*\/?>/gi, ". ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")

  for (const span of clauses(text)) {
    const lower = span.text.toLowerCase()
    /** Ranges already claimed by a longer alias in this clause. */
    const claimed: { start: number; end: number }[] = []

    for (const key of STAT_KEYS) {
      let searchStart = 0

      while (true) {
        const keyIndex = lower.indexOf(key, searchStart)

        if (keyIndex === -1) break

        searchStart = keyIndex + key.length

        // A shorter alias that starts inside a claimed match is the same
        // mention: "bonif. de daño de habilidad" inside
        // "bonif. de daño de habilidad de eco".
        const overlaps = claimed.some(
          (range) => keyIndex >= range.start && keyIndex < range.end
        )

        if (overlaps) continue

        const window = lower.slice(
          keyIndex + key.length,
          keyIndex + key.length + 44
        )
        const valueMatch =
          /(?:\s+del portador)?(?:\s+(?:de\s+)?(?:en\s+)?un)?\s+([\d.]+)%/.exec(
            window
          )

        if (!valueMatch) continue

        const statId = statIdFor(key)

        if (!statId) continue

        const value = Number(valueMatch[1])

        if (!Number.isFinite(value)) continue

        claimed.push({ start: keyIndex, end: keyIndex + key.length })

        occurrences.push({
          key,
          statId,
          value,
          context: lower,
        })
      }
    }
  }

  return occurrences
}

/** Whether the context marks the stat as main-slot bound. */
function isMainSlot(occurrence: StatOccurrence): boolean {
  return MAIN_SLOT_MARKERS.some((marker) => occurrence.context.includes(marker))
}

/** Whether the context demotes the stat to combat-only. */
function isCombat(occurrence: StatOccurrence): boolean {
  return COMBAT_MARKERS.some((marker) => occurrence.context.includes(marker))
}

/**
 * Bearer names of a conditional clause near the mention, if any.
 *
 * Two grammars: "Cuando Aemeath lo equipa…" and "Si lo equipa en la ranura
 * principal Errante: Aero o Cartethyia, aumenta…". The second lists bearers
 * separated by " o " after the slot mention.
 */
function bearersOf(occurrence: StatOccurrence): string[] {
  const when = /cuando ([a-záéíóúñ: ]+?) (?:lo|la) equipa/.exec(
    occurrence.context
  )

  if (when) {
    const bearer = when[1].trim()

    // Reject captures that are actually narration ("está equipado", "el
    // personaje ... tienen este eco").
    if (bearer.includes("personaje") || bearer.includes("está")) return []

    return bearer.split(/\s+o\s+/).map((name) => name.trim())
  }

  const have = /cuando ([a-záéíóúñ: ]+?) tienen este eco equipado/.exec(
    occurrence.context
  )

  if (have) {
    const bearer = have[1].trim()

    if (bearer.includes("personaje")) return []

    return bearer.split(/\s+o\s+/).map((name) => name.trim())
  }

  const si = /si lo equipa en la ranura principal ([^,]+?),/.exec(
    occurrence.context
  )

  if (si) {
    return si[1]
      .split(/\s+o\s+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
  }

  return []
}

/** Rover expansion of a bearer name. */
function roverIdsOf(bearer: string): string[] | null {
  return ROVER_IDS[bearer.trim().toLowerCase()] ?? null
}

/**
 * Plausible bonus range: real bonuses run from 4% (stack steps) to 40%
 * (special cases); damage percentages in the narration start at ~50%.
 */
const MAX_BONUS_VALUE = 40

/** Parses the echo skill text into bonus rows. */
export function parseEchoBonuses(description: string): ParsedEchoBonus[] {
  const bonuses: ParsedEchoBonus[] = []

  for (const occurrence of findOccurrences(description)) {
    if (occurrence.value > MAX_BONUS_VALUE) continue

    const bearers = bearersOf(occurrence)

    if (bearers.length > 0) {
      for (const bearer of bearers) {
        const rover = roverIdsOf(bearer)

        if (rover) {
          for (const id of rover) {
            bonuses.push({
              statId: occurrence.statId,
              value: occurrence.value,
              requiresMainSlot: true,
              condition: "resonator",
              conditionValue: id,
            })
          }

          continue
        }

        bonuses.push({
          statId: occurrence.statId,
          value: occurrence.value,
          requiresMainSlot: isMainSlot(occurrence),
          condition: "resonator",
          conditionValue: null,
          bearer,
        })
      }

      continue
    }

    const mainSlot = isMainSlot(occurrence)

    if (mainSlot) {
      // A main-slot sentence with a combat window stays display-only.
      bonuses.push({
        statId: occurrence.statId,
        value: occurrence.value,
        requiresMainSlot: true,
        condition: isCombat(occurrence) ? "combat" : "none",
        conditionValue: null,
      })

      continue
    }

    // No slot marker and no bearer: only keep it when the context is
    // explicitly combat-windowed, so damage narration never leaks in.
    if (isCombat(occurrence)) {
      bonuses.push({
        statId: occurrence.statId,
        value: occurrence.value,
        requiresMainSlot: false,
        condition: "combat",
        conditionValue: null,
      })
    }
  }

  return dedupe(bonuses)
}

/** Drops rows with the same stat, value, condition and bearer identity. */
function dedupe(bonuses: ParsedEchoBonus[]): ParsedEchoBonus[] {
  const seen = new Set<string>()

  return bonuses.filter((bonus) => {
    const key = `${bonus.statId}|${bonus.value}|${bonus.condition}|${bonus.conditionValue ?? ""}|${bonus.bearer ?? ""}`

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}
