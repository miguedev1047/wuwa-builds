import type { Resonator, ResonatorIndex } from "../domain/resonator"

/**
 * On Cloudflare, SSR runs in workerd, which has no `node:fs`. The data is
 * bundled into the server build with `import.meta.glob` (the JSON files are
 * committed to the repo).
 *
 * `.server.ts` plus dynamic imports from the server functions keep it out of
 * the client bundle.
 */
const files = import.meta.glob<{ default: Resonator | ResonatorIndex }>(
  "../../../data/wuwa-resonators/*.json",
  { eager: true }
)

let index: ResonatorIndex | null = null
const bySlug = new Map<string, Resonator>()

for (const [path, module] of Object.entries(files)) {
  if (path.endsWith("/index.json")) {
    index = module.default as ResonatorIndex
    continue
  }

  const resonator = module.default as Resonator
  bySlug.set(resonator.slug, resonator)
}

export function readBundledIndex(): ResonatorIndex | null {
  return index
}

export function readBundledResonator(slug: string): Resonator | null {
  return bySlug.get(slug) ?? null
}
