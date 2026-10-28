import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import type { Catalog, CatalogName } from "../domain/catalog"

/** Default scraper output for the shared catalogs (committed to git). */
export const DEFAULT_CATALOG_DIRECTORY = "src/data/wuwa-catalogs"

const FILE_NAMES: Record<CatalogName, string> = {
  weapons: "weapons",
  echoes: "echoes",
  echoSets: "echo-sets",
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T
  } catch {
    return null
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

export interface CatalogFileStore {
  /** Absolute path of the directory holding the JSON files. */
  directory: string
  read<T>(name: CatalogName): Promise<Catalog<T> | null>
  write<T>(name: CatalogName, catalog: Catalog<T>): Promise<void>
}

export function createCatalogFileStore(
  options: { directory?: string } = {}
): CatalogFileStore {
  const directory = resolve(
    process.cwd(),
    options.directory ??
      process.env.WUWA_CATALOGS_DIR ??
      DEFAULT_CATALOG_DIRECTORY
  )

  const file = (name: CatalogName) =>
    join(directory, `${FILE_NAMES[name]}.json`)

  return {
    directory,
    read: (name) => readJson(file(name)),
    write: (name, catalog) => writeJson(file(name), catalog),
  }
}
