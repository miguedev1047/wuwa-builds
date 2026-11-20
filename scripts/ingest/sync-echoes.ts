/**
 * Syncs the echo phase to the remote D1 database.
 *
 * Usage:
 *   bun scripts/ingest/sync-echoes.ts [--max-writes 90000] [--dry-run]
 */

import { parsePhaseArgs, runRemotePhase } from "./remote-sync"

const { maxWrites, dryRun } = parsePhaseArgs()

await runRemotePhase({
  label: "echoes",
  tables: ["echoes", "echo_sets", "echo_skills", "echo_skill_bonuses"],
  maxWrites,
  dryRun,
})
