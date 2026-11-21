import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { and, eq } from "drizzle-orm"
import { openLocalCatalog } from "../ingest/catalog-db"
import {
  buildDocumentSchema,
  BUILD_DOCUMENT_VERSION,
  type BuildPayload,
} from "@build/domain/build"
import type { BuildProps, EchoesDataProps } from "@build/domain/build-record"
import type {
  CharacterSummary,
  CharacterDetail,
} from "@catalog/domain/character"
import type { EchoDetail, EchoSummary } from "@catalog/domain/echo"
import type { WeaponDetail, WeaponSummary } from "@catalog/domain/weapon"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"
import { createBuildFromCharacter } from "@build/application/factories/build"
import {
  echoMainStatOptions,
  echoMainStatValue,
} from "@build/application/echo-main-stat"
import { echoSubstatOptions } from "@build/application/echo-substats"
import { resolveBuildCalculation } from "@build/application/calculation/resolve-build-calculation"
import {
  CHARACTER_STAT_KEYS,
  type CharacterCalculationResult,
} from "@build/domain/character-stats"
import { STAT_KINDS, STAT_LABELS } from "@build/domain/stats"
import { builds } from "@db/schemas/builds"
import { user } from "@db/schemas/auth-schema"
import { BUILD_SPECS, type BuildEchoSpec, type BuildSpec } from "./build-specs"

const ECHO_LEVEL = 25
const LEVEL_MAX = 90
const OUT_DIR = "builds"
const TMP_DIR = ".tmp/builds"
const KNOWN_DIAGNOSTIC = "break_impulse is not part of the resonator base stats"

interface CatalogSources {
  character: CharacterDetail
  characterSummary: CharacterSummary
  weapon: WeaponDetail
  weaponSummary: WeaponSummary
  echoes: EchoDetail[]
  echoSummaries: EchoSummary[]
  sonatas: SonataCatalogEntry[]
}

interface GeneratedBuild {
  spec: BuildSpec
  props: BuildProps
  payload: BuildPayload
  calculation: CharacterCalculationResult
  sources: CatalogSources
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function characterSummary(detail: CharacterDetail): CharacterSummary {
  return {
    id: detail.id,
    name: detail.name,
    introduction: detail.introduction,
    rarity: detail.rarity,
    element: detail.element,
    weaponType: detail.weaponType,
    icon: detail.icon,
    card: detail.card,
    iconLarge: detail.iconLarge,
    circle: detail.circle,
    portrait: detail.portrait,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    isVisible: detail.isVisible,
    isNew: detail.isNew,
    isCollab: detail.isCollab,
  }
}

function weaponSummary(detail: WeaponDetail): WeaponSummary {
  return {
    id: detail.id,
    name: detail.name,
    rarity: detail.rarity,
    icon: detail.icon,
    description: detail.description,
    type: detail.type,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  }
}

function echoSummary(detail: EchoDetail): EchoSummary {
  return {
    id: detail.id,
    name: detail.name,
    icon: detail.icon,
    cost: detail.cost,
    class: detail.class,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  }
}

async function loadSources(
  db: ReturnType<typeof openLocalCatalog>["db"],
  spec: BuildSpec
): Promise<CatalogSources> {
  const character = await db.query.resonators.findFirst({
    where: { id: spec.characterId },
    with: {
      media: { orderBy: { sortOrder: "asc" } },
      tags: { orderBy: { sortOrder: "asc" } },
      properties: {
        orderBy: { sortOrder: "asc" },
        with: { growth: { orderBy: { sortOrder: "asc" } } },
      },
      skills: { orderBy: { sortOrder: "asc" } },
      sequences: { orderBy: { sortOrder: "asc" } },
      passives: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!character) {
    throw new Error(`${spec.slug}: character ${spec.characterId} not found`)
  }

  const weapon = await db.query.weapons.findFirst({
    where: { id: spec.weaponId },
    with: {
      properties: {
        orderBy: { sortOrder: "asc" },
        with: { growth: { orderBy: { sortOrder: "asc" } } },
      },
      refinements: {
        orderBy: { sortOrder: "asc" },
        with: { stats: { orderBy: { sortOrder: "asc" } } },
      },
    },
  })

  if (!weapon) {
    throw new Error(`${spec.slug}: weapon ${spec.weaponId} not found`)
  }

  if (weapon.type !== character.weaponType) {
    throw new Error(
      `${spec.slug}: ${weapon.name} is ${weapon.type}, not ${character.weaponType}`
    )
  }

  const echoes: EchoDetail[] = []

  for (const slot of spec.echoes) {
    const echo = await db.query.echoes.findFirst({
      where: { id: slot.echoId },
      with: {
        sets: {
          orderBy: { sortOrder: "asc" },
          with: {
            sonata: true,
            sonataEffects: { orderBy: { pieces: "asc" } },
          },
        },
        skill: true,
        skillBonuses: { orderBy: { sortOrder: "asc" } },
      },
    })

    if (!echo) {
      throw new Error(`${spec.slug}: echo ${slot.echoId} not found`)
    }

    if (!echo.sets.some((set) => set.setId === slot.setId)) {
      throw new Error(
        `${spec.slug}: ${echo.name} does not belong to set ${slot.setId}`
      )
    }

    echoes.push(echo)
  }

  const sonatas = await db.query.sonataSets.findMany({
    with: { effects: { orderBy: { pieces: "asc" } } },
  })

  const characterDetail: CharacterDetail = {
    ...character,
    bestWeapons: [],
    bestSets: [],
  }

  return {
    character: characterDetail,
    characterSummary: characterSummary(characterDetail),
    weapon,
    weaponSummary: weaponSummary(weapon),
    echoes,
    echoSummaries: echoes.map(echoSummary),
    sonatas,
  }
}

function buildEcho(
  slot: BuildEchoSpec,
  index: number,
  detail: EchoDetail
): EchoesDataProps {
  const options = echoMainStatOptions(detail.cost)
  const main = options.find((option) => option.stat === slot.mainStatId)

  if (!main) {
    throw new Error(
      `${detail.name}: ${slot.mainStatId} is not a cost ${detail.cost} main stat`
    )
  }

  const seen = new Set<string>()

  const substats = slot.substats.map((substat, substatIndex) => {
    if (seen.has(substat.statId)) {
      throw new Error(`${detail.name}: repeated substat ${substat.statId}`)
    }

    seen.add(substat.statId)

    const option = echoSubstatOptions(detail.cost).find(
      (entry) => entry.stat === substat.statId
    )

    if (!option) {
      throw new Error(
        `${detail.name}: ${substat.statId} is not a cost ${detail.cost} substat`
      )
    }

    if (!option.values.includes(substat.value)) {
      throw new Error(
        `${detail.name}: ${substat.value} is not a legal ${substat.statId} roll`
      )
    }

    return {
      index: substatIndex,
      valueStat: substat.statId,
      valueLabel: option.label,
      valueNumber: substat.value,
    }
  })

  if (substats.length !== 5) {
    throw new Error(`${detail.name}: expected 5 substats`)
  }

  return {
    data: echoSummary(detail),
    index,
    echoSetId: slot.setId,
    mainStatStat: main.stat,
    mainStatLabel: main.label,
    mainStatValue: echoMainStatValue({
      cost: detail.cost,
      stat: main.stat,
      level: ECHO_LEVEL,
    }),
    level: ECHO_LEVEL,
    cost: detail.cost,
    substats,
  }
}

function toPayload(build: BuildProps, notes: string): BuildPayload {
  const payload: BuildPayload = {
    resonator: {
      level: build.resonator.level,
      sequenceRank: build.resonator.sequency,
      skillLevels: build.resonator.skills.map((skill) => ({
        skillId: skill.skillId,
        level: skill.level,
      })),
      passives: build.resonator.passives.map((passive) => ({
        passiveId: passive.passiveId,
        enabled: passive.enabled,
      })),
    },
    weapon: {
      weaponId: build.weapon.data?.id ?? null,
      level: build.weapon.level,
      refinementRank: build.weapon.refinament,
    },
    echoLoadout: [
      build.echoes[0],
      build.echoes[1],
      build.echoes[2],
      build.echoes[3],
      build.echoes[4],
    ].map((echo) => ({
      echoId: echo.data?.id ?? null,
      level: echo.level,
      mainStatId: echo.mainStatStat || null,
      sonataId: echo.echoSetId,
      substats: echo.substats
        .filter((substat) => substat.valueStat !== "")
        .map((substat) => ({
          statId: substat.valueStat,
          value: substat.valueNumber,
        })),
    })) as BuildPayload["echoLoadout"],
    mainEchoSlot: build.mainEchoSlot as BuildPayload["mainEchoSlot"],
    backgroundIndex: build.backgroundIndex,
    notes,
  }

  return payload
}

function generateBuild(
  spec: BuildSpec,
  sources: CatalogSources,
  userId: string
): GeneratedBuild {
  if (spec.echoes.length !== 5) {
    throw new Error(`${spec.slug}: expected 5 echo slots`)
  }

  if (
    !Number.isInteger(spec.mainEchoSlot) ||
    spec.mainEchoSlot < 0 ||
    spec.mainEchoSlot > 4
  ) {
    throw new Error(`${spec.slug}: mainEchoSlot must be 0..4`)
  }

  if (spec.refinementRank < 1 || spec.refinementRank > 5) {
    throw new Error(`${spec.slug}: refinementRank must be 1..5`)
  }

  if (spec.sequenceRank < 0 || spec.sequenceRank > 6) {
    throw new Error(`${spec.slug}: sequenceRank must be 0..6`)
  }

  const totalCost = sources.echoes.reduce((sum, echo) => sum + echo.cost, 0)

  if (totalCost > 12) {
    throw new Error(`${spec.slug}: echo cost ${totalCost} exceeds 12`)
  }

  const createdAt = new Date().toISOString()
  const build = createBuildFromCharacter({
    buildId: randomUUID(),
    userId,
    createdAt,
    character: sources.characterSummary,
    detail: sources.character,
  })

  build.name = spec.name
  build.backgroundIndex = spec.backgroundIndex
  build.mainEchoSlot = spec.mainEchoSlot
  build.resonator.level = LEVEL_MAX
  build.resonator.sequency = spec.sequenceRank
  build.weapon = {
    level: LEVEL_MAX,
    refinament: spec.refinementRank,
    data: sources.weaponSummary,
  }
  build.echoes = spec.echoes.map((slot, index) =>
    buildEcho(slot, index, sources.echoes[index])
  )

  const calculation = resolveBuildCalculation({
    build,
    resonator: sources.character,
    weapon: sources.weapon,
    echoDetails: sources.echoes,
    sonatas: sources.sonatas,
  })

  if (!calculation) {
    throw new Error(`${spec.slug}: calculation returned null`)
  }

  const diagnostics = calculation.diagnostics.filter(
    (diagnostic) => diagnostic !== KNOWN_DIAGNOSTIC
  )

  if (diagnostics.length > 0) {
    throw new Error(`${spec.slug}: ${diagnostics.join(", ")}`)
  }

  const payload = buildDocumentSchema.parse({
    documentVersion: BUILD_DOCUMENT_VERSION,
    payload: toPayload(build, spec.notes),
  }).payload

  return { spec, props: build, payload, calculation, sources }
}

function statsRecord(calculation: CharacterCalculationResult) {
  return Object.fromEntries(
    CHARACTER_STAT_KEYS.map((key) => [
      key,
      {
        label: STAT_LABELS[key],
        value: calculation.stats[key],
        kind: STAT_KINDS[key],
      },
    ])
  )
}

function packBuild(generated: GeneratedBuild) {
  const { spec, sources, calculation } = generated
  const elementStat =
    `${sources.character.element}_dmg` as keyof typeof calculation.stats

  return {
    slug: spec.slug,
    name: spec.name,
    character: {
      id: sources.character.id,
      name: sources.character.name,
      element: sources.character.element,
      weaponType: sources.character.weaponType,
      rarity: sources.character.rarity,
      icon: sources.character.icon,
      card: sources.character.card,
      portrait: sources.character.portrait,
      iconLarge: sources.character.iconLarge,
    },
    weapon: {
      id: sources.weapon.id,
      name: sources.weapon.name,
      rarity: sources.weapon.rarity,
      type: sources.weapon.type,
      icon: sources.weapon.icon,
      refinementRank: spec.refinementRank,
    },
    resonator: {
      level: LEVEL_MAX,
      sequenceRank: spec.sequenceRank,
      skills: generated.props.resonator.skills.map((skill) => ({
        skillId: skill.skillId,
        level: skill.level,
      })),
    },
    echoes: generated.props.echoes.map((echo) => ({
      slot: echo.index + 1,
      echoId: echo.data?.id ?? null,
      name: echo.data?.name ?? "",
      icon: echo.data?.icon ?? "",
      cost: echo.cost,
      setId: echo.echoSetId,
      setName:
        sources.sonatas.find((set) => set.id === echo.echoSetId)?.name ?? "",
      mainStatId: echo.mainStatStat,
      mainStatLabel: echo.mainStatLabel,
      mainStatValue: echo.mainStatValue,
      substats: echo.substats.map((substat) => ({
        statId: substat.valueStat,
        label: substat.valueLabel,
        value: substat.valueNumber,
      })),
    })),
    mainEchoSlot: spec.mainEchoSlot,
    stats: statsRecord(calculation),
    elementBonus: {
      statId: elementStat,
      value: calculation.stats[elementStat] ?? 0,
    },
    conditionalEffects: calculation.conditionalEffects
      .map((effect) => ({
        source: effect.source,
        description: stripHtml(effect.description),
      }))
      .filter((effect) => !effect.description.endsWith(": 0")),
    notes: spec.notes,
  }
}

function formatValue(value: number, kind: "flat" | "percent"): string {
  return kind === "flat"
    ? String(Math.round(value))
    : `${Number(value.toFixed(1))}%`
}

function readme(generated: GeneratedBuild[]): string {
  const rows = generated.map(({ spec, calculation, sources }) => {
    const stats = calculation.stats
    const element = sources.character.element
    return `| ${spec.name} | ${sources.character.name} | ${sources.weapon.name} | ${stats.hp.toFixed(0)} | ${stats.atk.toFixed(0)} | ${formatValue(stats.crit_rate, "percent")} | ${formatValue(stats.crit_dmg, "percent")} | ${formatValue(stats.energy_regen, "percent")} | ${formatValue(stats[`${element}_dmg` as keyof typeof stats], "percent")} |`
  })

  return [
    "# Builds de exhibición",
    "",
    "Cinco builds generadas con `bun scripts/builds/generate-builds.ts` a partir del",
    "catálogo canónico en D1. Los ids, sets, main stats y substats se validan contra",
    "el catálogo; los cálculos usan el mismo motor que el builder.",
    "",
    "| Build | Resonador | Arma | Vida | ATQ | CRIT | Daño CRIT | Regen. | Elemento |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...rows,
    "",
    "## Lectura de las builds",
    "",
    ...generated.flatMap(({ spec, sources }) => [
      `### ${spec.name} — ${sources.character.name}`,
      "",
      spec.notes,
      "",
      `- Arma: **${sources.weapon.name}** (R${spec.refinementRank}, nivel ${LEVEL_MAX}).`,
      `- Sets: ${[
        ...new Map(
          spec.echoes.map((echo) => [
            echo.setId,
            spec.echoes.filter((item) => item.setId === echo.setId).length,
          ])
        ),
      ]
        .map(
          ([setId, count]) =>
            `**${sources.sonatas.find((set) => set.id === setId)?.name ?? setId}** ×${count}`
        )
        .join(" + ")}.`,
      `- Eco principal: **${sources.echoes[spec.mainEchoSlot].name}**.`,
      "",
    ]),
    "## Capturas",
    "",
    "- `builds/pack.json`: datos de las cinco builds.",
    "- `builds/screenshots/overview.png`: hoja de contacto 2×3.",
    "- `builds/screenshots/<slug>.png` y `<slug>-canvas.png`: capturas del builder.",
    "",
  ].join("\n")
}

async function seedD1(
  db: ReturnType<typeof openLocalCatalog>["db"],
  generated: GeneratedBuild[],
  userId: string
) {
  for (const { spec, payload } of generated) {
    await db
      .delete(builds)
      .where(and(eq(builds.userId, userId), eq(builds.name, spec.name)))
    await db.insert(builds).values({
      id: randomUUID(),
      userId,
      characterId: spec.characterId,
      name: spec.name,
      payload,
      documentVersion: BUILD_DOCUMENT_VERSION,
    })
  }
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const catalog = openLocalCatalog()
  const [admin] = await catalog.db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.role, "ADMIN"))
    .limit(1)

  if (!admin) {
    throw new Error("No ADMIN user in the local D1 database")
  }

  const generated: GeneratedBuild[] = []

  for (const spec of BUILD_SPECS) {
    const sources = await loadSources(catalog.db, spec)
    const build = generateBuild(spec, sources, admin.id)
    generated.push(build)

    const stats = build.calculation.stats
    const element = build.sources.character.element
    console.log(
      [
        spec.slug.padEnd(11),
        build.sources.character.name.padEnd(11),
        `HP ${stats.hp.toFixed(0).padStart(6)}`,
        `ATK ${stats.atk.toFixed(0).padStart(5)}`,
        `CR ${formatValue(stats.crit_rate, "percent").padStart(6)}`,
        `CD ${formatValue(stats.crit_dmg, "percent").padStart(6)}`,
        `ER ${formatValue(stats.energy_regen, "percent").padStart(6)}`,
        `${element} ${formatValue(stats[`${element}_dmg` as keyof typeof stats], "percent").padStart(6)}`,
      ].join("  ")
    )
  }

  await mkdir(OUT_DIR, { recursive: true })
  await mkdir(TMP_DIR, { recursive: true })

  const pack = {
    version: 1,
    generatedAt: new Date().toISOString(),
    game: "Wuthering Waves",
    builds: generated.map(packBuild),
  }

  await writeFile(
    join(OUT_DIR, "pack.json"),
    `${JSON.stringify(pack, null, 2)}\n`
  )
  await writeFile(join(OUT_DIR, "README.md"), `${readme(generated)}\n`)
  await writeFile(
    join(TMP_DIR, "local-builds.json"),
    `${JSON.stringify(
      Object.fromEntries(
        generated.map(({ props }) => [
          `s:${props.buildId}`,
          { versionKey: randomUUID(), data: props },
        ])
      ),
      null,
      2
    )}\n`
  )
  await writeFile(
    join(TMP_DIR, "payloads.json"),
    `${JSON.stringify(
      generated.map(({ spec, payload }) => ({ slug: spec.slug, payload })),
      null,
      2
    )}\n`
  )

  if (args.has("--seed-d1")) {
    await seedD1(catalog.db, generated, admin.id)
    console.log(`Seeded ${generated.length} builds into D1 for ${admin.id}`)
  }

  console.log(`Wrote ${OUT_DIR}/pack.json and ${OUT_DIR}/README.md`)
  catalog.local.close()
}

await main()
