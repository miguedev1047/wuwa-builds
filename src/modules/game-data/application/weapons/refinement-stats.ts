import {
  STAT_OPTIONS,
  STATS,
} from "@/modules/game-data/application/stats/stats"

/**
 * Stats a weapon refinement can grant.
 *
 * The list is the canonical vocabulary: `statId` is the id the select binds to
 * and `weapon_refinement_stats.stat_name` stores, so the builder can sum it
 * without matching a label.
 */
export const WEAPON_REFINEMENT_STATS = STATS

/** Options of the stat select in the refinement dialogs. */
export const WEAPON_REFINEMENT_STAT_OPTIONS = STAT_OPTIONS
