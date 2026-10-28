import type { Resonator, ResonatorIndex } from "../domain/resonator"

/**
 * En Cloudflare el SSR corre en workerd, que no tiene `node:fs`. Los datos se
 * empaquetan en el bundle del servidor en build time con `import.meta.glob`
 * (los JSON están versionados en el repo).
 *
 * `.server.ts` + import dinámico desde las server functions: no llega al bundle
 * del cliente.
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
