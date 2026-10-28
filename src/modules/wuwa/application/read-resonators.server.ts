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
 * Los datos se empaquetan en build (`resonators-bundle.server.ts`) para que
 * funcionen tanto en Node como en workerd, donde no existe `node:fs`.
 * El scraper sigue escribiendo en `src/data`, pero el runtime no lee del disco.
 */
export async function readResonatorsIndex(): Promise<ResonatorIndex | null> {
  return readBundledIndex()
}

export async function readResonator(slug: string): Promise<Resonator | null> {
  if (!isResonatorSlug(slug)) return null
  return readBundledResonator(slug)
}
