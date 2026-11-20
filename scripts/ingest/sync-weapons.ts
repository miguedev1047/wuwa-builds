/**
 * Syncs the weapon phase to the remote D1 database.
 *
 * The resonator's `best weapons` link table references this phase's parent, so
 * the phase clears it before replacing the weapons and restores it from local
 * afterwards.
 *
 * Usage:
 *   bun scripts/ingest/sync-weapons.ts [--max-writes 90000] [--dry-run]
 */

import { parsePhaseArgs, runRemotePhase } from "./remote-sync"

const { maxWrites, dryRun } = parsePhaseArgs()

await runRemotePhase({
  label: "weapons",
  tables: [
    "weapons",
    "weapon_properties",
    "weapon_property_growth",
    "weapon_refinements",
    "weapon_refinement_stats",
  ],
  dependents: ["resonator_best_weapons"],
  maxWrites,
  dryRun,
})
