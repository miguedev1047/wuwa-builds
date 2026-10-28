#!/usr/bin/env bun
/**
 * Development CLI for the scraper. Not imported by the app: it only exists so
 * the data can be refreshed without opening the browser.
 *
 *   bun run scrape
 *   bun run scrape --force
 *   bun run scrape --only aalto,carlotta
 */
import process from "node:process"
import { scrapeRequest } from "../application/schemas"
import { scrapeResonators } from "../application/scrape-resonators.server"
import type { ScrapeEvent, ScrapeOptions } from "../domain/resonator"

const argv = process.argv.slice(2)

const hasFlag = (name: string) => argv.includes(`--${name}`)

function getOption(name: string): string | undefined {
  const index = argv.indexOf(`--${name}`)
  if (index === -1) return undefined
  const value = argv[index + 1]
  return value && !value.startsWith("--") ? value : undefined
}

function getNumberOption(name: string): number | undefined {
  const raw = getOption(name)
  if (raw === undefined) return undefined

  const value = Number(raw)
  if (!Number.isFinite(value)) throw new Error(`--${name} must be a number`)
  return value
}

function printEvent(event: ScrapeEvent): void {
  switch (event.kind) {
    case "listing":
      console.log(`Characters to process: ${event.total}`)
      break
    case "character": {
      const label = `[${event.done}/${event.total}] ${event.slug}`
      if (event.status === "failed") {
        console.error(`${label} FAILED: ${event.error}`)
      } else {
        console.log(`${label} ${event.status}`)
      }
      break
    }
    case "index":
      console.log(`Index rebuilt with ${event.count} characters`)
      break
  }
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.error("The scraper is a development-only tool.")
    process.exit(1)
  }

  const parsed = scrapeRequest.safeParse({
    force: hasFlag("force"),
    only: getOption("only")
      ?.split(",")
      .map((slug) => slug.trim())
      .filter(Boolean),
    limit: getNumberOption("limit"),
    concurrency: getNumberOption("concurrency"),
    delayMs: getNumberOption("delay"),
  })

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "options"}: ${issue.message}`)
      .join("\n")
    console.error(issues)
    process.exit(1)
  }

  const options: ScrapeOptions = {
    ...parsed.data,
    outDir: getOption("out"),
  }

  const report = await scrapeResonators(options, { onProgress: printEvent })

  console.log(`\nData directory: ${report.directory}`)
  console.log(
    `Scraped ${report.scraped}, cached ${report.cached}, failed ${report.failed.length}`
  )

  if (report.failed.length > 0) {
    for (const failure of report.failed) {
      console.error(` - ${failure.slug}: ${failure.error}`)
    }
    process.exitCode = 1
  }
}

await main()
