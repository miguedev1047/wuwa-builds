/**
 * Catalog ingest CLI: Encore (base data) + Prydwen (recommendations) → D1.
 *
 * Usage:
 *   bun scripts/ingest/encore-catalog.ts status
 *   bun scripts/ingest/encore-catalog.ts import-character <encoreId>
 *   bun scripts/ingest/encore-catalog.ts import-all [--limit N]
 *   bun scripts/ingest/encore-catalog.ts sync-sonatas
 *   bun scripts/ingest/encore-catalog.ts verify <encoreId>
 *
 * Targets the local miniflare D1 used by `bun run dev`. The Prydwen reader
 * shells out to curl because Bun's fetch is blocked by Cloudflare's challenge
 * while curl passes.
 */

import { parseArgs } from "node:util"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  echoSkillBonuses,
  resonatorBestSets,
  resonatorBestWeapons,
  weaponRefinementStats,
  sonataSetEffects,
  sonataSets,
} from "@db/schema"
import { eq } from "drizzle-orm"
import { openLocalCatalog, type CatalogDb } from "./catalog-db"
import {
  buildNameIndex,
  isRoverPair,
  matchPrydwenPage,
  matchSonataId,
  type NameIndex,
} from "./match-names"
import { parseCharacterPage, type PrydwenCharacter } from "./prydwen"
import { parseRefinementStat } from "./refinement-stats"
import { parseEchoBonuses } from "./echo-bonuses"
import {
  readCharacter,
  readCharacters,
} from "@encore/application/read-characters.server"
import {
  readWeapon,
  readEcho,
  readSonataSets,
} from "@encore/application/read-catalogs.server"
import {
  saveCharacter,
  saveWeapon,
  saveEcho,
} from "@catalog/infrastructure/catalog-d1.server"
import { toSonataEffectDraft } from "@catalog/application/echoes/sonatas"

interface CatalogStatus {
  id: number
  name: string
  state: "NEW" | "PARTIAL" | "READY"
  bestWeapons: number
  bestSets: number
  imported: boolean
}

const CACHE_DIR = ".tmp/prydwen-cache"

function now(): number {
  return Date.now()
}

/** Reads the cached Prydwen page or fetches it through curl. */
async function cachedPrydwen(slug: string): Promise<PrydwenCharacter> {
  const cache = join(CACHE_DIR, `${slug}.html`)

  try {
    return parseCharacterPage(slug, readFileSync(cache, "utf8"))
  } catch {
    // Miss: fetch below.
  }

  const html = await curlPrydwen(slug)
  writeFileSync(cache, html, "utf8")

  return parseCharacterPage(slug, html)
}

/** Fetches one Prydwen page with curl (Bun fetch is challenge-blocked). */
async function curlPrydwen(slug: string): Promise<string> {
  const url = `https://www.prydwen.gg/wuthering-waves/characters/${slug}`

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const result = Bun.spawnSync({
      cmd: [
        "curl",
        "-s",
        "--max-time",
        "30",
        "-A",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
        url,
      ],
      stdout: "pipe",
      stderr: "pipe",
    })

    const html = result.stdout.toString()

    if (result.exitCode === 0 && html.includes("Best Weapons")) {
      return html
    }

    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
  }

  throw new Error(`Prydwen fetch failed for ${slug}`)
}

/** Slug for an Encore character id, from the Prydwen characters index. */
async function prydwenSlug(
  index: NameIndex,
  characterId: number
): Promise<string | null> {
  const html = await curlPrydwenIndex()
  const slugs = [
    ...html.matchAll(/href="\/wuthering-waves\/characters\/([^"#?]+)"/g),
  ].map((match) => match[1])

  const name = index.characterNames.get(characterId)

  if (!name) return null

  return slugForName(name, slugs)
}

function slugForName(name: string, slugs: string[]): string | null {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  for (const slug of slugs) {
    if (slug === normalized) return slug
  }

  const manual: Record<string, string> = {
    Shorekeeper: "the-shorekeeper",
    "Rover: Aero": "rover-aero",
    "Rover: Spectro": "rover-spectro",
    "Rover: Havoc": "rover-havoc",
    "Rover: Electro": "rover-electro",
    "Yangyang: Xuanling": "yangyang-xuanling",
  }

  const mapped = manual[name]

  return mapped && slugs.includes(mapped) ? mapped : null
}

let cachedIndexHtml: string | null = null

async function curlPrydwenIndex(): Promise<string> {
  if (cachedIndexHtml) return cachedIndexHtml

  const result = Bun.spawnSync({
    cmd: [
      "curl",
      "-s",
      "--max-time",
      "30",
      "-A",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
      "https://www.prydwen.gg/wuthering-waves/characters",
    ],
    stdout: "pipe",
    stderr: "pipe",
  })

  const html = result.stdout.toString()

  if (result.exitCode !== 0 || !html.includes("characters/")) {
    throw new Error("Prydwen index fetch failed")
  }

  cachedIndexHtml = html

  return html
}

/** Classification derived entirely from the database. */
async function buildStatus(catalog: CatalogDb): Promise<CatalogStatus[]> {
  const encore = await readCharacters()
  const rows = await catalog.db.query.resonators.findMany({
    with: { bestWeapons: true, bestSets: true },
  })
  const byId = new Map(rows.map((row) => [row.id, row]))

  return encore.map((character) => {
    const row = byId.get(character.id)
    const imported = row !== undefined
    const bestWeapons = row?.bestWeapons.length ?? 0
    const bestSets = row?.bestSets.length ?? 0
    const state: CatalogStatus["state"] = !imported
      ? "NEW"
      : bestWeapons === 0 || bestSets === 0
        ? "PARTIAL"
        : "READY"

    return {
      id: character.id,
      name: character.name,
      state,
      bestWeapons,
      bestSets,
      imported,
    }
  })
}

function printStatus(status: CatalogStatus[]) {
  const ready = status.filter((entry) => entry.state === "READY")
  const partial = status.filter((entry) => entry.state === "PARTIAL")
  const fresh = status.filter((entry) => entry.state === "NEW")

  console.log(
    `READY: ${ready.length}  PARTIAL: ${partial.length}  NEW: ${fresh.length}  TOTAL: ${status.length}\n`
  )

  for (const entry of partial) {
    console.log(
      `PARTIAL ${entry.id} ${entry.name} (armas: ${entry.bestWeapons}, sets: ${entry.bestSets})`
    )
  }

  for (const entry of fresh) {
    console.log(`NEW     ${entry.id} ${entry.name}`)
  }
}

/** Imports one character with its Prydwen recommendations. */
async function importCharacter(
  catalog: CatalogDb,
  index: NameIndex,
  characterId: number,
  options: { dryRun?: boolean } = {}
): Promise<void> {
  const detail = await readCharacter(characterId)
  const slug = await prydwenSlug(index, characterId)

  if (!slug) {
    throw new Error(
      `No Prydwen slug for character ${characterId} (${detail.name})`
    )
  }

  const page = await cachedPrydwen(slug)
  const matched = matchPrydwenPage(index, page)

  // A rover slug resolves to the pair's first id; importing the second id is
  // valid because Encore publishes one document per id with the same content.
  if (
    matched.characterId !== characterId &&
    !isRoverPair(matched.characterId ?? 0, characterId)
  ) {
    throw new Error(
      `Slug mismatch: ${slug} resolved to ${matched.characterId}, expected ${characterId}`
    )
  }

  const unmatchedWeapons = matched.weapons.filter(
    (weapon) => weapon.id === null
  )

  if (unmatchedWeapons.length > 0) {
    console.warn(
      `[warn] unmatched weapons: ${unmatchedWeapons.map((w) => w.name).join(", ")}`
    )
  }

  const sonataLinks: { setId: number; name: string }[] = []

  for (const set of page.sets) {
    const setId = matchSonataId(index, set.name)

    if (setId === undefined) {
      console.warn(`[warn] sonata not matched: ${set.name}`)
      continue
    }

    const exists = await catalog.db.query.sonataSets.findFirst({
      where: { id: setId },
      columns: { id: true },
    })

    if (!exists) {
      console.warn(
        `[warn] sonata ${set.name} matched to ${setId} but not in D1; run sync-sonatas`
      )
      continue
    }

    sonataLinks.push({ setId, name: set.name })
  }

  console.log(`${detail.name} (${characterId}) slug=${slug}`)
  console.log(
    `  armas: ${matched.weapons.map((w) => `${w.name}${w.id ? "" : "?"}`).join(", ")}`
  )
  console.log(`  sets : ${sonataLinks.map((s) => s.name).join(", ")}`)

  if (options.dryRun) return

  // `saveEcho` cascades curated bonus rows, so they are captured first and
  // re-inserted after each echo save below.
  const previousBonuses = await catalog.db.query.echoSkillBonuses.findMany()

  // `saveWeapon` deletes the weapon row, which cascades every
  // `resonator_best_weapons` link pointing at it — including links that
  // belong to other resonators. All links are snapshotted and restored after
  // the saves, so a shared weapon never erases another character's
  // recommendation.
  const weaponLinksSnapshot =
    await catalog.db.query.resonatorBestWeapons.findMany()
  const setLinksSnapshot = await catalog.db.query.resonatorBestSets.findMany()

  await saveCharacter(catalog.db, detail)

  // Best weapons: import each weapon once, link by Prydwen order.
  for (const weapon of matched.weapons) {
    if (weapon.id === null) continue

    const weaponDetail = await readWeapon(weapon.id)
    await saveWeapon(catalog.db, weaponDetail)

    const refinements = await catalog.db.query.weaponRefinements.findMany({
      where: { weaponId: weapon.id },
      orderBy: { sortOrder: "asc" },
      with: { stats: true },
    })

    for (const refinement of refinements) {
      const parsed = parseRefinementStat(refinement.effect)

      if (!parsed) continue
      if (refinement.stats.length > 0) continue

      await catalog.db.insert(weaponRefinementStats).values({
        refinementId: refinement.id,
        sortOrder: 1,
        statName: parsed.statId,
        statNumber: parsed.value,
        createdAt: new Date(now()),
        updatedAt: new Date(now()),
      })
    }
  }

  // `saveCharacter` cascades this resonator's links away and `saveWeapon`
  // cascaded every shared link, so the full snapshot is restored first and
  // this resonator's links are then rewritten in Prydwen order.
  await catalog.db.delete(resonatorBestWeapons)

  for (const link of weaponLinksSnapshot) {
    await catalog.db.insert(resonatorBestWeapons).values({
      resonatorId: link.resonatorId,
      weaponId: link.weaponId,
      sortOrder: link.sortOrder,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    })
  }

  await catalog.db
    .delete(resonatorBestWeapons)
    .where(eq(resonatorBestWeapons.resonatorId, characterId))

  for (const [order, weapon] of matched.weapons.entries()) {
    if (weapon.id === null) continue

    await catalog.db.insert(resonatorBestWeapons).values({
      resonatorId: characterId,
      weaponId: weapon.id,
      sortOrder: order + 1,
      createdAt: new Date(now()),
      updatedAt: new Date(now()),
    })
  }

  await catalog.db.delete(resonatorBestSets)

  for (const link of setLinksSnapshot) {
    await catalog.db.insert(resonatorBestSets).values({
      resonatorId: link.resonatorId,
      setId: link.setId,
      sortOrder: link.sortOrder,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    })
  }

  await catalog.db
    .delete(resonatorBestSets)
    .where(eq(resonatorBestSets.resonatorId, characterId))

  for (const [order, set] of sonataLinks.entries()) {
    await catalog.db.insert(resonatorBestSets).values({
      resonatorId: characterId,
      setId: set.setId,
      sortOrder: order + 1,
      createdAt: new Date(now()),
      updatedAt: new Date(now()),
    })
  }

  // Main echoes: import and parse bonuses.
  const echoNames = new Map<number, string>()

  for (const set of matched.sets) {
    for (const echo of set.mainEchoes) {
      if (echo.id === null) {
        console.warn(`[warn] unmatched echo: ${echo.name}`)
        continue
      }

      const echoDetail = await readEcho(echo.id)

      // `saveEcho` cascades bonus rows, so they are captured first and
      // re-inserted (parsed + preserved) after the save.
      const preserved = previousBonuses.filter(
        (bonus) => bonus.echoId === echo.id
      )

      await saveEcho(catalog.db, echoDetail)
      echoNames.set(echo.id, echo.name)

      for (const bonus of preserved) {
        await catalog.db.insert(echoSkillBonuses).values({
          echoId: echo.id,
          statId: bonus.statId,
          value: bonus.value,
          requiresMainSlot: bonus.requiresMainSlot,
          condition: bonus.condition,
          conditionValue: bonus.conditionValue,
          sortOrder: bonus.sortOrder,
          createdAt: new Date(now()),
          updatedAt: new Date(now()),
        })
      }

      const previous = preserved
      const parsed = parseEchoBonuses(
        echoDetail.skill?.description ??
          echoDetail.skill?.simpleDescription ??
          ""
      )

      for (const bonus of parsed) {
        let conditionValue = bonus.conditionValue

        if (bonus.bearer) {
          const resolved = bearerCharacterId(index, bonus.bearer)

          if (resolved === null) {
            console.warn(`[warn] unresolved bearer: ${bonus.bearer}`)
            continue
          }

          conditionValue = String(resolved)
        }

        const duplicated = previous.some(
          (row) =>
            row.statId === bonus.statId &&
            row.value === bonus.value &&
            row.condition === bonus.condition &&
            row.conditionValue === conditionValue
        )

        if (duplicated) continue

        await catalog.db.insert(echoSkillBonuses).values({
          echoId: echo.id,
          statId: bonus.statId,
          value: bonus.value,
          requiresMainSlot: bonus.requiresMainSlot,
          condition: bonus.condition,
          conditionValue,
          sortOrder: previous.length,
          createdAt: new Date(now()),
          updatedAt: new Date(now()),
        })
      }
    }
  }

  console.log(`  echo importados: ${echoNames.size}`)
}

/** Resolves an English bearer name to an Encore character id. */
function bearerCharacterId(index: NameIndex, bearer: string): number | null {
  for (const [id, name] of index.characterNames) {
    if (name.toLowerCase() === bearer.toLowerCase()) return id
  }

  return null
}

/** Imports every sonata set Encore knows, like the panel sync. */
async function syncSonatas(catalog: CatalogDb): Promise<void> {
  const sets = await readSonataSets()
  const current = await catalog.db.query.sonataSets.findMany({
    with: { effects: true },
  })
  const byId = new Map(current.map((set) => [set.id, set]))

  for (const set of sets) {
    const existing = byId.get(set.id)

    if (existing) {
      await catalog.db
        .update(sonataSets)
        .set({
          name: set.name,
          icon: set.icon,
          color: set.color,
          updatedAt: new Date(now()),
        })
        .where(eq(sonataSets.id, set.id))
    } else {
      await catalog.db.insert(sonataSets).values({
        id: set.id,
        name: set.name,
        icon: set.icon,
        color: set.color,
        source: "encore",
        createdAt: new Date(now()),
        updatedAt: new Date(now()),
      })
    }

    await catalog.db
      .delete(sonataSetEffects)
      .where(eq(sonataSetEffects.setId, set.id))

    if (set.effects.length > 0) {
      await catalog.db.insert(sonataSetEffects).values(
        set.effects.map((effect, order) => ({
          setId: set.id,
          sortOrder: order,
          createdAt: new Date(now()),
          updatedAt: new Date(now()),
          ...toSonataEffectDraft(effect),
        }))
      )
    }
  }

  console.log(`sonatas sincronizadas: ${sets.length}`)
}

/** Verifies one character against the acceptance checklist. */
async function verifyCharacter(
  catalog: CatalogDb,
  characterId: number
): Promise<boolean> {
  const resonator = await catalog.db.query.resonators.findFirst({
    where: { id: characterId },
    with: {
      bestWeapons: {
        with: { weapon: { with: { refinements: { with: { stats: true } } } } },
      },
      bestSets: true,
    },
  })

  if (!resonator) {
    console.log(`FAIL: ${characterId} not imported`)
    return false
  }

  const problems: string[] = []

  if (resonator.bestWeapons.length === 0) problems.push("sin best weapons")
  if (resonator.bestSets.length === 0) problems.push("sin best sets")

  for (const link of resonator.bestWeapons) {
    if (!link.weapon) {
      problems.push(`weapon ${link.weaponId} missing`)
      continue
    }

    for (const refinement of link.weapon.refinements) {
      if (refinement.stats.length === 0 && refinement.effect) {
        const parsed = parseRefinementStat(refinement.effect)

        if (parsed) {
          problems.push(
            `refinement ${refinement.sortOrder} of ${link.weapon.name} parseable but empty`
          )
        }
      }
    }
  }

  if (problems.length > 0) {
    console.log(`WARN ${resonator.name}: ${problems.join("; ")}`)
    return false
  }

  console.log(`OK   ${resonator.name}`)
  return true
}

async function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      limit: { type: "string" },
      "dry-run": { type: "boolean" },
      json: { type: "boolean" },
    },
    allowPositionals: true,
  })

  const command = positionals[0]
  const catalog = openLocalCatalog()

  try {
    if (command === "status") {
      const status = await buildStatus(catalog)

      if (values.json) {
        console.log(JSON.stringify(status, null, 2))
        return
      }

      printStatus(status)
      return
    }

    if (command === "sync-sonatas") {
      await syncSonatas(catalog)
      return
    }

    if (command === "verify") {
      const characterId = Number(positionals[1])

      if (!Number.isInteger(characterId)) {
        throw new Error("verify needs a character id")
      }

      await verifyCharacter(catalog, characterId)
      return
    }

    if (command === "import-character") {
      const characterId = Number(positionals[1])

      if (!Number.isInteger(characterId)) {
        throw new Error("import-character needs a character id")
      }

      const index = await buildNameIndex()

      await importCharacter(catalog, index, characterId, {
        dryRun: values["dry-run"],
      })
      return
    }

    if (command === "import-all") {
      const status = await buildStatus(catalog)
      const pending = status.filter((entry) => entry.state !== "READY")
      const limit = values.limit ? Number(values.limit) : undefined
      const batch = limit ? pending.slice(0, limit) : pending
      const index = await buildNameIndex()

      console.log(
        `importando ${batch.length} de ${pending.length} pendientes\n`
      )

      for (const entry of batch) {
        try {
          await importCharacter(catalog, index, entry.id)
        } catch (error) {
          console.error(`[error] ${entry.name}: ${(error as Error).message}`)
        }
      }

      return
    }

    console.log(
      "commands: status | import-character <id> | import-all | sync-sonatas | verify <id>"
    )
  } finally {
    catalog.local.close()
  }
}

if (import.meta.main) {
  await main()
}
