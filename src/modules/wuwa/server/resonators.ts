import { createServerFn } from "@tanstack/react-start"
import { getResonatorInput, scrapeRequest } from "../application/schemas"

/**
 * Server functions are the only entry point the UI should use.
 *
 * The implementations live in `.server.ts` modules and are loaded lazily inside
 * each handler, so no Node-only code (fs, curl) can leak into the client
 * bundle.
 */
export const getResonators = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readResonatorsIndex } =
      await import("../application/read-resonators.server")
    return readResonatorsIndex()
  }
)

/**
 * The scraped profile is mostly passthrough JSON from Prydwen (`unknown` index
 * signatures), so the default strict output check is disabled here. The value
 * is plain JSON and serializes fine over the RPC boundary.
 */
export const getResonator = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .validator(getResonatorInput)
  .handler(async ({ data }) => {
    const { readResonator } =
      await import("../application/read-resonators.server")
    return readResonator(data.slug)
  })

/**
 * Development-only: scraping requires curl and writes into `src/data`, so it
 * must never be exposed by a production deployment.
 */
export const scrapeResonators = createServerFn({ method: "POST" })
  .validator(scrapeRequest)
  .handler(async ({ data }) => {
    if (!import.meta.env.DEV) {
      throw new Error("Scraping is only available in development")
    }

    const { scrapeResonators } =
      await import("../application/scrape-resonators.server")
    return scrapeResonators(data)
  })
