import type { Catalog } from "../domain/catalog"
import type { Echo, EchoSet, Weapon } from "../domain/resonator"

/**
 * Catalogs are bundled at build time for the same reason as resonators: SSR
 * runs in workerd, which has no `node:fs`. `.server.ts` plus dynamic imports
 * from the server functions keep them out of the client bundle.
 */
const files = import.meta.glob<{ default: Catalog<unknown> }>(
  "../../../data/wuwa-catalogs/*.json",
  { eager: true }
)

function pick<T>(name: string): Catalog<T> | null {
  for (const [path, module] of Object.entries(files)) {
    if (path.endsWith(`/${name}.json`)) return module.default as Catalog<T>
  }
  return null
}

const weaponCatalog = pick<Weapon>("weapons")
const echoCatalog = pick<Echo>("echoes")
const echoSetCatalog = pick<EchoSet>("echo-sets")

const weaponsById = new Map<string, Weapon>()
const weaponsBySlug = new Map<string, Weapon>()
for (const weapon of weaponCatalog?.items ?? []) {
  weaponsById.set(weapon.ID, weapon)
  weaponsBySlug.set(weapon.Slug, weapon)
}

const echoesById = new Map<string, Echo>()
const echoesBySlug = new Map<string, Echo>()
for (const echo of echoCatalog?.items ?? []) {
  echoesById.set(echo.ID, echo)
  echoesBySlug.set(echo.Slug, echo)
}

const echoSetsById = new Map<string, EchoSet>()
const echoSetsBySlug = new Map<string, EchoSet>()
for (const echoSet of echoSetCatalog?.items ?? []) {
  echoSetsById.set(String(echoSet.sonata_id), echoSet)
  echoSetsBySlug.set(echoSet.slug, echoSet)
}

export function getWeaponCatalog(): Catalog<Weapon> | null {
  return weaponCatalog
}

export function findWeapon(lookup: {
  id?: string
  slug?: string
}): Weapon | null {
  if (lookup.id) return weaponsById.get(lookup.id) ?? null
  if (lookup.slug) return weaponsBySlug.get(lookup.slug) ?? null
  return null
}

export function getEchoCatalog(): Catalog<Echo> | null {
  return echoCatalog
}

export function findEcho(lookup: { id?: string; slug?: string }): Echo | null {
  if (lookup.id) return echoesById.get(lookup.id) ?? null
  if (lookup.slug) return echoesBySlug.get(lookup.slug) ?? null
  return null
}

export function getEchoSetCatalog(): Catalog<EchoSet> | null {
  return echoSetCatalog
}

export function findEchoSet(lookup: {
  sonataId?: number
  slug?: string
}): EchoSet | null {
  if (lookup.sonataId !== undefined) {
    return echoSetsById.get(String(lookup.sonataId)) ?? null
  }
  if (lookup.slug) return echoSetsBySlug.get(lookup.slug) ?? null
  return null
}
