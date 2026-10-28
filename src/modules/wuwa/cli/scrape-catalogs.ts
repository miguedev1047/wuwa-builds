#!/usr/bin/env bun
/**
 * Development CLI for the shared catalogs (weapons, echoes, echo sets).
 *
 *   bun run scrape:catalogs
 *   bun run scrape:catalogs --force
 */
import process from "node:process"
import { scrapeCatalogs } from "../application/scrape-catalogs.server"
import type { CatalogScrapeEvent } from "../domain/catalog"

const argv = process.argv.slice(2)

const hasFlag = (name: string) => argv.includes(`--${name}`)

function getOption(name: string): string | undefined {
  const index = argv.indexOf(`--${name}`)
  if (index === -1) return undefined
  const value = argv[index + 1]
  return value && !value.startsWith("--") ? value : undefined
}

function printEvent(event: CatalogScrapeEvent): void {
  const label = event.name.padEnd(9)
  if (event.status === "failed") {
    console.error(`${label} FAILED: ${event.error}`)
  } else {
    console.log(`${label} ${event.count} items (${event.status})`)
  }
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.error("The scraper is a development-only tool.")
    process.exit(1)
  }

  const report = await scrapeCatalogs(
    { force: hasFlag("force"), outDir: getOption("out") },
    { onProgress: printEvent }
  )

  const results = [report.weapons, report.echoes, report.echoSets]
  const count = (status: string) =>
    results.filter((result) => result.status === status).length

  console.log(`\nData directory: ${report.directory}`)
  console.log(
    `Scraped ${count("scraped")}, unchanged ${count("unchanged")}, failed ${count("failed")}`
  )

  if (count("failed") > 0) process.exitCode = 1
}

await main()
