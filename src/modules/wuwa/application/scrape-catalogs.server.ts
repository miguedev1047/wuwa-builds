import type {
  Catalog,
  CatalogName,
  CatalogScrapeEvent,
  CatalogScrapeReport,
  ScrapeCatalogsOptions,
} from "../domain/catalog"
import { isSameCatalogContent } from "../domain/catalog"
import type { Echo, EchoSet, Weapon } from "../domain/resonator"
import {
  createCatalogFileStore,
  type CatalogFileStore,
} from "../infrastructure/catalog-file-store.server"
import {
  readEchoesPage,
  readWeaponsPage,
} from "../infrastructure/prydwen/catalogs-page.server"
import { fetchPageWithRetry } from "../infrastructure/prydwen/http.server"

const ORIGIN = "https://www.prydwen.gg"
const WEAPONS_PATH = "/wuthering-waves/weapons"
const ECHOES_PATH = "/wuthering-waves/echoes"

export interface ScrapeCatalogHooks {
  /** Injected for tests; defaults to curl + retries. */
  fetchPage?: (url: string) => Promise<string>
  /** Injected for tests; defaults to the JSON file store. */
  store?: CatalogFileStore
  onProgress?: (event: CatalogScrapeEvent) => void
}

/**
 * Scrapes the weapon and echo catalogs from Prydwen and writes
 * `src/data/wuwa-catalogs/*.json`.
 *
 * Each catalog is a single page payload (no detail pages), so this is two
 * requests total. Development-only, like the resonator scraper.
 */
export async function scrapeCatalogs(
  options: ScrapeCatalogsOptions = {},
  hooks: ScrapeCatalogHooks = {}
): Promise<CatalogScrapeReport> {
  const fetchPage = hooks.fetchPage ?? fetchPageWithRetry
  const store =
    hooks.store ?? createCatalogFileStore({ directory: options.outDir })

  const report: CatalogScrapeReport = {
    directory: store.directory,
    weapons: { status: "failed", count: 0 },
    echoes: { status: "failed", count: 0 },
    echoSets: { status: "failed", count: 0 },
  }

  const save = async <T>(
    name: CatalogName,
    source: string,
    items: T[]
  ): Promise<void> => {
    const next: Catalog<T> = {
      source,
      fetchedAt: new Date().toISOString(),
      count: items.length,
      items,
    }
    const previous = await store.read<T>(name)
    const status =
      !options.force && previous && isSameCatalogContent(previous, next)
        ? "unchanged"
        : "scraped"

    if (status === "scraped") await store.write(name, next)

    report[name] = { status, count: items.length }
    hooks.onProgress?.({
      kind: "catalog",
      name,
      status,
      count: items.length,
    })
  }

  const fail = (name: CatalogName, error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    report[name] = { status: "failed", count: 0, error: message }
    hooks.onProgress?.({
      kind: "catalog",
      name,
      status: "failed",
      count: 0,
      error: message,
    })
  }

  try {
    const html = await fetchPage(`${ORIGIN}${WEAPONS_PATH}`)
    await save<Weapon>(
      "weapons",
      `${ORIGIN}${WEAPONS_PATH}`,
      readWeaponsPage(html)
    )
  } catch (error) {
    fail("weapons", error)
  }

  try {
    const html = await fetchPage(`${ORIGIN}${ECHOES_PATH}`)
    const { echoes, echoSets } = readEchoesPage(html)

    await save<Echo>("echoes", `${ORIGIN}${ECHOES_PATH}`, echoes).catch(
      (error) => fail("echoes", error)
    )
    await save<EchoSet>("echoSets", `${ORIGIN}${ECHOES_PATH}`, echoSets).catch(
      (error) => fail("echoSets", error)
    )
  } catch (error) {
    fail("echoes", error)
    fail("echoSets", error)
  }

  return report
}
