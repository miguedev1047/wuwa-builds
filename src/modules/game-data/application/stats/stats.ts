import {
  STAT_KEYS,
  STAT_LABELS,
  STAT_KINDS,
  type BuildStatKey,
} from "@/modules/builds/domain/stats"
import type { SelectOption } from "@/modules/game-data/application/options"

/**
 * Panel view of the canonical stat vocabulary.
 *
 * The ids come from `STAT_KINDS`, shared with the builder, so an option can
 * never point to a key the calculation does not know. `statId` and `value` are
 * the same string on purpose: one identifier, no translation layer.
 */
export const STATS = STAT_KEYS.map((statId) => ({
  statId,
  label: STAT_LABELS[statId],
}))

export type StatId = BuildStatKey

/** Non-empty tuple for `z.enum` and other APIs that need at least one key. */
export const STAT_IDS = STAT_KEYS as [StatId, ...StatId[]]

/** Options of every stat select. */
export const STAT_OPTIONS: SelectOption<StatId>[] = STATS.map(
  ({ label, statId }) => ({ label, value: statId })
)

/** Options for a subset of stats, preserving the canonical order. */
export function statOptions(ids: readonly StatId[]): SelectOption<StatId>[] {
  return ids.map((statId) => ({ label: STAT_LABELS[statId], value: statId }))
}

/** Panel label of a stat, falling back to the raw id. */
export function statLabel(statId: string): string {
  return STAT_LABELS[statId as StatId] ?? statId
}

/** Narrows a stored string to the canonical stat union. */
export function isStatId(value: string | null): value is StatId {
  return value !== null && value in STAT_KINDS
}
