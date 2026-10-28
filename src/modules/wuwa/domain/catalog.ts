import type { Echo, EchoSet, Weapon } from "./resonator"

export interface Catalog<T> {
  source: string
  fetchedAt: string
  count: number
  items: T[]
}

export type WeaponCatalog = Catalog<Weapon>
export type EchoCatalog = Catalog<Echo>
export type EchoSetCatalog = Catalog<EchoSet>

export type CatalogName = "weapons" | "echoes" | "echoSets"

export interface CatalogResult {
  status: "scraped" | "unchanged" | "failed"
  count: number
  error?: string
}

export interface CatalogScrapeReport {
  directory: string
  weapons: CatalogResult
  echoes: CatalogResult
  echoSets: CatalogResult
}

export type CatalogScrapeEvent = {
  kind: "catalog"
  name: CatalogName
  status: CatalogResult["status"]
  count: number
  error?: string
}

export interface ScrapeCatalogsOptions {
  /** Rewrite even when the catalog is identical (only refreshes `fetchedAt`). */
  force?: boolean
  /** Overrides the default `src/data/wuwa-catalogs` directory (CLI only). */
  outDir?: string
}

/**
 * True when a freshly scraped catalog is identical to the stored one.
 * `fetchedAt` is ignored so a monthly refresh only rewrites real changes.
 */
export function isSameCatalogContent<T>(a: Catalog<T>, b: Catalog<T>): boolean {
  return (
    JSON.stringify({ ...a, fetchedAt: null }) ===
    JSON.stringify({ ...b, fetchedAt: null })
  )
}
