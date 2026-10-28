import type {
  Rating,
  ResonatorIndex,
  ResonatorIndexEntry,
  ScrapeEvent,
  ScrapeOptions,
  ScrapeReport,
} from "../domain/resonator"
import { isSameResonatorContent } from "../domain/resonator"
import { readCharacterCards } from "../infrastructure/prydwen/characters-page.server"
import { parseCharacterPage } from "../infrastructure/prydwen/flight.server"
import { fetchPageWithRetry } from "../infrastructure/prydwen/http.server"
import {
  toIndexEntry,
  toResonator,
} from "../infrastructure/prydwen/mapper.server"
import {
  createResonatorFileStore,
  type ResonatorFileStore,
} from "../infrastructure/resonators-file-store.server"

const ORIGIN = "https://www.prydwen.gg"
const CHARACTERS_PATH = "/wuthering-waves/characters"

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))

export interface ScrapeHooks {
  /** Injected for tests; defaults to curl + retries. */
  fetchPage?: (url: string) => Promise<string>
  /** Injected for tests; defaults to the JSON file store. */
  store?: ResonatorFileStore
  onProgress?: (event: ScrapeEvent) => void
}

/**
 * Scrapes every resonator build from prydwen.gg and writes
 * `src/data/wuwa-resonators/*.json` plus the roster `index.json`.
 *
 * Only meant to run on a developer machine (see the server function guard and
 * the CLI check).
 */
export async function scrapeResonators(
  options: ScrapeOptions = {},
  hooks: ScrapeHooks = {}
): Promise<ScrapeReport> {
  const fetchPage = hooks.fetchPage ?? fetchPageWithRetry
  const store =
    hooks.store ?? createResonatorFileStore({ directory: options.outDir })

  const force = options.force ?? false
  const only = new Set(options.only ?? [])
  const limit = Math.max(0, options.limit ?? 0)
  const concurrency = Math.max(1, options.concurrency ?? 3)
  const delayMs = Math.max(0, options.delayMs ?? 400)

  const listHtml = await fetchPage(`${ORIGIN}${CHARACTERS_PATH}`)
  const cards = readCharacterCards(listHtml)

  if (cards.length === 0) {
    throw new Error("No character cards found in the characters index page")
  }

  let targets =
    only.size > 0 ? cards.filter((card) => only.has(card.slug)) : cards
  if (only.size > 0 && targets.length === 0) {
    throw new Error(`No characters matched --only ${[...only].join(",")}`)
  }
  if (limit > 0) targets = targets.slice(0, limit)

  const previousIndex = await store.readIndex()
  const previousEntries = new Map<string, ResonatorIndexEntry>(
    (previousIndex?.characters ?? []).map((entry) => [entry.slug, entry])
  )

  hooks.onProgress?.({ kind: "listing", total: targets.length })

  const ratings = new Map<string, Rating>()
  const failed: { slug: string; error: string }[] = []
  const report: ScrapeReport = {
    total: targets.length,
    scraped: 0,
    unchanged: 0,
    cached: 0,
    failed,
    indexCount: 0,
    directory: store.directory,
  }

  const queue = [...targets]
  let done = 0

  const worker = async () => {
    for (let card = queue.shift(); card; card = queue.shift()) {
      const url = `${ORIGIN}${CHARACTERS_PATH}/${card.slug}`
      const position = ++done

      const isCached = !force && (await store.hasResonator(card.slug))
      if (isCached) {
        report.cached++
        hooks.onProgress?.({
          kind: "character",
          slug: card.slug,
          done: position,
          total: targets.length,
          status: "cached",
        })
      } else {
        try {
          const html = await fetchPage(url)
          const page = parseCharacterPage(html)

          if (!page) {
            throw new Error("Character payload not found in the page")
          }

          for (const rating of page.ratings as Rating[]) {
            ratings.set(rating.slug, rating)
          }

          const resonator = toResonator(page.payload, url)
          const stored = await store.readResonator(card.slug)

          if (stored && isSameResonatorContent(stored, resonator)) {
            report.unchanged++
            hooks.onProgress?.({
              kind: "character",
              slug: card.slug,
              done: position,
              total: targets.length,
              status: "unchanged",
            })
          } else {
            await store.writeResonator(resonator)
            report.scraped++
            hooks.onProgress?.({
              kind: "character",
              slug: card.slug,
              done: position,
              total: targets.length,
              status: "scraped",
            })
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          failed.push({ slug: card.slug, error: message })
          hooks.onProgress?.({
            kind: "character",
            slug: card.slug,
            done: position,
            total: targets.length,
            status: "failed",
            error: message,
          })
        }
      }

      if (delayMs > 0) await sleep(delayMs)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, targets.length) }, worker)
  )

  // The list page is the source of truth for the roster (it includes upcoming
  // characters without ratings); ratings only enrich each entry.
  const index: ResonatorIndex = {
    source: `${ORIGIN}${CHARACTERS_PATH}`,
    fetchedAt: new Date().toISOString(),
    count: cards.length,
    characters: cards.map((card) =>
      toIndexEntry(
        card,
        ratings.get(card.slug) ?? null,
        previousEntries.get(card.slug) ?? null
      )
    ),
  }

  await store.writeIndex(index)
  report.indexCount = index.count

  hooks.onProgress?.({ kind: "index", count: index.count })

  return report
}
