import { access, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import {
  isResonatorSlug,
  type Resonator,
  type ResonatorIndex,
} from "../domain/resonator"

/** Default scraper output, relative to the project root (committed to git). */
export const DEFAULT_DATA_DIRECTORY = "src/data/wuwa-resonators"

const INDEX_FILE = "index.json"

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

async function exists(file: string): Promise<boolean> {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

export interface ResonatorFileStore {
  /** Absolute path of the directory holding the JSON files. */
  directory: string
  readIndex(): Promise<ResonatorIndex | null>
  readResonator(slug: string): Promise<Resonator | null>
  hasResonator(slug: string): Promise<boolean>
  writeResonator(resonator: Resonator): Promise<void>
  writeIndex(index: ResonatorIndex): Promise<void>
}

/**
 * JSON file persistence for the resonator data. Keeps the application layer
 * unaware of where the files live.
 */
export function createResonatorFileStore(
  options: { directory?: string } = {}
): ResonatorFileStore {
  const directory = resolve(
    process.cwd(),
    options.directory ??
      process.env.WUWA_RESONATORS_DIR ??
      DEFAULT_DATA_DIRECTORY
  )

  const resonatorFile = (slug: string) => join(directory, `${slug}.json`)

  return {
    directory,

    readIndex: () => readJson<ResonatorIndex>(join(directory, INDEX_FILE)),

    async readResonator(slug) {
      if (!isResonatorSlug(slug)) return null
      return readJson<Resonator>(resonatorFile(slug))
    },

    hasResonator(slug) {
      return isResonatorSlug(slug)
        ? exists(resonatorFile(slug))
        : Promise.resolve(false)
    },

    writeResonator(resonator) {
      return writeJson(resonatorFile(resonator.slug), resonator)
    },

    writeIndex(index) {
      return writeJson(join(directory, INDEX_FILE), index)
    },
  }
}
