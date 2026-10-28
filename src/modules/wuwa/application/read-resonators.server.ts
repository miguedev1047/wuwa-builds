import {
  isResonatorSlug,
  type Resonator,
  type ResonatorIndex,
} from "../domain/resonator"
import {
  readBundledIndex,
  readBundledResonator,
} from "../infrastructure/resonators-bundle.server"

/**
 * Read side of the domain.
 *
 * Data is bundled at build time (`resonators-bundle.server.ts`) so it works on
 * both Node and workerd, where `node:fs` does not exist. The scraper still
 * writes to `src/data`, but the runtime never reads from disk.
 */
export async function readResonatorsIndex(): Promise<ResonatorIndex | null> {
  return readBundledIndex()
}

export async function readResonator(slug: string): Promise<Resonator | null> {
  if (!isResonatorSlug(slug)) return null
  return readBundledResonator(slug)
}
