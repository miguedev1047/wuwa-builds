/**
 * Syncs the resonator phase to the remote D1 database.
 *
 * Usage:
 *   bun scripts/ingest/sync-resonators.ts [--max-writes 90000] [--dry-run]
 */

import { parsePhaseArgs, runRemotePhase } from "./remote-sync"

const { maxWrites, dryRun } = parsePhaseArgs()

await runRemotePhase({
  label: "resonators",
  tables: [
    "resonators",
    "resonators_media",
    "resonator_tags",
    "resonator_property_levels",
    "resonator_property_growth",
    "resonator_skills",
    "resonator_sequences",
    "resonator_passives",
    "resonator_best_weapons",
    "resonator_best_sets",
  ],
  maxWrites,
  dryRun,
})
