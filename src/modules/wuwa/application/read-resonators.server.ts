import {
  isResonatorSlug,
  type Resonator,
  type ResonatorIndex,
} from "../domain/resonator"
import { createResonatorFileStore } from "../infrastructure/resonators-file-store.server"

/**
 * Read side of the domain. The data is generated in development by the
 * scraper (`scrapeResonators`) and consumed by the app at runtime.
 */
export async function readResonatorsIndex(): Promise<ResonatorIndex | null> {
  return createResonatorFileStore().readIndex()
}

export async function readResonator(slug: string): Promise<Resonator | null> {
  if (!isResonatorSlug(slug)) return null
  return createResonatorFileStore().readResonator(slug)
}
