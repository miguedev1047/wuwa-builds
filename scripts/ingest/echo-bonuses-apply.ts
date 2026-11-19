/**
 * Echo bonus backfill: applies `parseEchoBonuses` to every echo that has a
 * skill text but no bonus rows yet.
 *
 * The parser implements the catalog curation rule (see the
 * catalog-resonator-ingest skill): main-slot statics become `none`/main rows
 * the builder sums, bearer-specific statics become `resonator` rows, and
 * windowed mentions become display-only `combat` rows. Existing curated rows
 * are never touched — this only fills gaps.
 *
 * Usage:
 *   bun scripts/ingest/echo-bonuses-apply.ts [--dry-run]
 */

import { parseArgs } from "node:util"
import { openLocalCatalog, type CatalogDb } from "./catalog-db"
import { parseEchoBonuses } from "./echo-bonuses"
import { buildNameIndex, type NameIndex } from "./match-names"
import { echoSkillBonuses as echoSkillBonusesTable } from "@db/schema"

/** Manual exceptions the parser cannot derive from the text. */
const MANUAL_EXCEPTIONS: {
  echoId: number
  echo: string
  reason: string
  rows: {
    statId: string
    value: number
    requiresMainSlot: boolean
    condition: string
    conditionValue: string | null
  }[]
}[] = [
  {
    echoId: 6000060,
    echo: "Falacia sin Regresión",
    reason:
      '"el personaje gana un 10% de Regen." y "todos los personajes del equipo reciben un 10% de ATQ extra durante 20 s": gramática de equipo sin marcador de ranura',
    rows: [
      {
        statId: "energy_regen",
        value: 10,
        requiresMainSlot: true,
        condition: "none",
        conditionValue: null,
      },
      {
        statId: "atk_percent",
        value: 10,
        requiresMainSlot: true,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 390080007,
    echo: "Jinete Infernal",
    reason:
      '"aumentar el Daño Fusión del personaje actual... durante 15 s": ventana de combate sobre el portador, curada como combat/main',
    rows: [
      {
        statId: "fusion_dmg",
        value: 12,
        requiresMainSlot: true,
        condition: "combat",
        conditionValue: null,
      },
      {
        statId: "basic_atk_bonus",
        value: 12,
        requiresMainSlot: true,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000195,
    echo: "Glamut",
    reason:
      '"aumenta un 12.00% la Bonif. de Daño Gelio del siguiente personaje": bono para el siguiente personaje, combat sin main slot',
    rows: [
      {
        statId: "glacio_dmg",
        value: 12,
        requiresMainSlot: false,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000053,
    echo: "Insomne",
    reason:
      '"El Daño de esta Habilidad de Eco se incrementa en un 50.00% durante los primeros 5 s": daño del propio eco con ventana, echo_skill_bonus combat (decisión del usuario)',
    rows: [
      {
        statId: "echo_skill_bonus",
        value: 50,
        requiresMainSlot: true,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000059,
    echo: "Jué",
    reason:
      '"Bendición del tiempo: la bonificación adicional de la Habilidad de resonancia aumenta en un 16.00%" con ventana de 15 s: skill_bonus combat',
    rows: [
      {
        statId: "skill_bonus",
        value: 16,
        requiresMainSlot: true,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000052,
    echo: "Garza Impermanencia",
    reason:
      '"el daño causado por el siguiente personaje se incrementa en un 12% durante 15 s": bono para el siguiente personaje, combat',
    rows: [
      {
        statId: "havoc_dmg",
        value: 12,
        requiresMainSlot: false,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000189,
    echo: "Hyvatia",
    reason:
      '"aumenta un 10.00% la Bonif. de daño de todos los atributos del siguiente personaje": combat, descompuesto en 6 stats elementales como la convención de armas',
    rows: [
      "aero_dmg",
      "glacio_dmg",
      "electro_dmg",
      "fusion_dmg",
      "havoc_dmg",
      "spectro_dmg",
    ].map((statId) => ({
      statId,
      value: 10,
      requiresMainSlot: false,
      condition: "combat",
      conditionValue: null,
    })),
  },
  {
    echoId: 6000200,
    echo: "Reminiscencia: Denia",
    reason:
      '"la Bonif. de Daño Fusión del siguiente personaje que entre al campo aumenta un 12.00%": combat',
    rows: [
      {
        statId: "fusion_dmg",
        value: 12,
        requiresMainSlot: false,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000198,
    echo: "Polilla de Vacío",
    reason:
      '"el ATQ del siguiente personaje que entre al campo aumenta un 12.00%": combat',
    rows: [
      {
        statId: "atk_percent",
        value: 12,
        requiresMainSlot: false,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
  {
    echoId: 6000224,
    echo: "Desgarralmas",
    reason:
      '"la Bonif. de Daño Electro del siguiente personaje que entre al campo aumenta un 12.00%": combat',
    rows: [
      {
        statId: "electro_dmg",
        value: 12,
        requiresMainSlot: false,
        condition: "combat",
        conditionValue: null,
      },
    ],
  },
]

function now(): number {
  return Date.now()
}

/** Resolves a bearer name (lowercase ES/EN) to an Encore character id. */
function bearerCharacterId(index: NameIndex, bearer: string): number | null {
  for (const [id, name] of index.characterNames) {
    if (name.toLowerCase() === bearer.toLowerCase()) return id
  }

  return null
}

interface AppliedRow {
  echo: string
  statId: string
  value: number
  condition: string
  conditionValue: string | null
  requiresMainSlot: boolean
  source: "parser" | "exception"
}

async function applyEchoBonuses(
  catalog: CatalogDb,
  index: NameIndex,
  dryRun: boolean
): Promise<AppliedRow[]> {
  const echoes = await catalog.db.query.echoes.findMany({
    with: { skill: true, skillBonuses: true },
  })
  const applied: AppliedRow[] = []

  for (const echo of echoes) {
    if (echo.cost === 1) continue
    if (echo.skillBonuses.length > 0) continue

    const description = echo.skill?.description ?? ""
    const parsed = parseEchoBonuses(description)
    const exception = MANUAL_EXCEPTIONS.find(
      (entry) => entry.echoId === echo.id
    )

    if (parsed.length === 0 && !exception) continue

    let sortOrder = 0

    if (dryRun) {
      for (const bonus of parsed) {
        applied.push({
          echo: echo.name,
          statId: bonus.statId,
          value: bonus.value,
          condition: bonus.condition,
          conditionValue: bonus.conditionValue,
          requiresMainSlot: bonus.requiresMainSlot,
          source: "parser",
        })
      }

      if (exception) {
        for (const row of exception.rows) {
          applied.push({
            echo: echo.name,
            statId: row.statId,
            value: row.value,
            condition: row.condition,
            conditionValue: row.conditionValue,
            requiresMainSlot: row.requiresMainSlot,
            source: "exception",
          })
        }
      }

      continue
    }

    for (const bonus of parsed) {
      let conditionValue = bonus.conditionValue

      if (bonus.bearer) {
        const resolved = bearerCharacterId(index, bonus.bearer)

        if (resolved === null) {
          console.warn(
            `[warn] bearer sin resolver: ${bonus.bearer} (${echo.name})`
          )
          continue
        }

        conditionValue = String(resolved)
      }

      await catalog.db.insert(echoSkillBonusesTable).values({
        echoId: echo.id,
        statId: bonus.statId,
        value: bonus.value,
        requiresMainSlot: bonus.requiresMainSlot,
        condition: bonus.condition,
        conditionValue,
        sortOrder,
        createdAt: new Date(now()),
        updatedAt: new Date(now()),
      })

      applied.push({
        echo: echo.name,
        statId: bonus.statId,
        value: bonus.value,
        condition: bonus.condition,
        conditionValue,
        requiresMainSlot: bonus.requiresMainSlot,
        source: "parser",
      })

      sortOrder += 1
    }

    if (exception) {
      for (const row of exception.rows) {
        await catalog.db.insert(echoSkillBonusesTable).values({
          echoId: echo.id,
          statId: row.statId,
          value: row.value,
          requiresMainSlot: row.requiresMainSlot,
          condition: row.condition,
          conditionValue: row.conditionValue,
          sortOrder,
          createdAt: new Date(now()),
          updatedAt: new Date(now()),
        })

        applied.push({
          echo: echo.name,
          statId: row.statId,
          value: row.value,
          condition: row.condition,
          conditionValue: row.conditionValue,
          requiresMainSlot: row.requiresMainSlot,
          source: "exception",
        })

        sortOrder += 1
      }

      console.log(`[exception] ${exception.echo}: ${exception.reason}`)
    }
  }

  return applied
}

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: { "dry-run": { type: "boolean" } },
    allowPositionals: true,
  })

  const dryRun = values["dry-run"] === true
  const catalog = openLocalCatalog()

  try {
    const index = await buildNameIndex()
    const applied = await applyEchoBonuses(catalog, index, dryRun)

    console.log(`\nfilas aplicadas: ${applied.length}`)

    const byEcho = new Map<string, AppliedRow[]>()

    for (const row of applied) {
      const rows = byEcho.get(row.echo) ?? []
      rows.push(row)
      byEcho.set(row.echo, rows)
    }

    for (const [echo, rows] of byEcho) {
      console.log(
        `  ${echo}: ${rows
          .map(
            (row) =>
              `${row.statId}:${row.value}/${row.condition}${row.conditionValue ? ":" + row.conditionValue : ""}${row.requiresMainSlot ? "/main" : ""} [${row.source}]`
          )
          .join(" | ")}`
      )
    }

    const stillEmpty = await catalog.db.query.echoes.findMany({
      with: { skill: true, skillBonuses: true },
    })
    const missing = stillEmpty.filter(
      (echo) => echo.cost !== 1 && echo.skillBonuses.length === 0
    )

    console.log(`\necos cost>1 sin bonos después de aplicar: ${missing.length}`)

    for (const echo of missing) {
      console.log(`  [cost ${echo.cost}] ${echo.name} (${echo.id})`)
    }
  } finally {
    catalog.local.close()
  }
}

if (import.meta.main) {
  await main()
}
