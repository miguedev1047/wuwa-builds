import { describe, expect, test } from "bun:test"
import {
  parseRefinementStat,
  parseRefinementStats,
  stripEffectHtml,
} from "../refinement-stats"
import { parseEchoBonuses } from "../echo-bonuses"
import { htmlToLines, parseBestWeapons, parseBestSets } from "../prydwen"
import { isRoverPair, matchSonataId, type NameIndex } from "../match-names"
import { readFileSync } from "node:fs"
import { join } from "node:path"

describe("stripEffectHtml", () => {
  test("removes colored span markup", () => {
    const effect =
      'Los PS máximos aumentan un <span style="color:#ffd12f;" class="font-bold">12%</span>.'

    expect(stripEffectHtml(effect)).toBe("Los PS máximos aumentan un 12%.")
  })
})

describe("parseRefinementStat", () => {
  test("reads the first static clause", () => {
    expect(parseRefinementStat("El ATQ aumenta un 12%.")).toEqual({
      statId: "atk_percent",
      value: 12,
    })
  })

  test("reads HP with maximos wording", () => {
    expect(parseRefinementStat("Los PS máximos aumentan un 12%.")).toEqual({
      statId: "hp_percent",
      value: 12,
    })
  })

  test("reads Bonif. de daño Aero", () => {
    expect(
      parseRefinementStat("La Bonif. de Daño Aero aumenta un 10%.")
    ).toEqual({ statId: "aero_dmg", value: 10 })
  })

  test("reads del portador wording", () => {
    expect(
      parseRefinementStat(
        "su Bonif. de daño de Ataque básico aumenta en un 20%"
      )
    ).toEqual({ statId: "basic_atk_bonus", value: 20 })
  })

  test("returns null for combat-only triggers", () => {
    expect(
      parseRefinementStat(
        "Durante 15 s tras lanzar la Habilidad Intro, el daño infligido ignora un 8% de la DEF del objetivo."
      )
    ).toBeNull()
  })

  test("returns null for unknown stat labels", () => {
    expect(
      parseRefinementStat("La energía de concierto aumenta un 12%.")
    ).toBeNull()
  })

  test("reads verb-first clauses", () => {
    expect(
      parseRefinementStat("Aumenta la Regen. de energía en un 12.8%.")
    ).toEqual({ statId: "energy_regen", value: 12.8 })

    expect(
      parseRefinementStat("Incrementa la Regen. de energía un 12.8%.")
    ).toEqual({ statId: "energy_regen", value: 12.8 })
  })

  test("reads Daño de la Habilidad wording", () => {
    expect(
      parseRefinementStat(
        "Aumenta el Daño de la Habilidad de resonancia en un 12%."
      )
    ).toEqual({ statId: "skill_bonus", value: 12 })
  })

  test("rejects stats behind a combat trigger", () => {
    expect(
      parseRefinementStat(
        "Cuando los PS del Resonador están por encima de 80%, aumenta el ATQ un 12%."
      )
    ).toBeNull()

    expect(
      parseRefinementStat(
        "Al lanzar la Habilidad de resonancia, se obtienen 6 de energía y se aumenta el ATQ en un 10%."
      )
    ).toBeNull()

    expect(
      parseRefinementStat(
        "Dentro de 12 s después de que se libera la Habilidad, aumenta el ATQ un 3%."
      )
    ).toBeNull()
  })

  test("rejects stats followed by a post-positioned trigger", () => {
    expect(
      parseRefinementStat(
        "Aumenta el ATQ un 4% al infligir Daño de Ataque básico, acumulándose hasta 5 veces."
      )
    ).toBeNull()
  })

  test("keeps a static stat whose next sentence carries the trigger", () => {
    expect(
      parseRefinementStat(
        "Aumenta la Regen. de energía en un 12.8%. Cuando se libera la Habilidad, el daño aumenta."
      )
    ).toEqual({ statId: "energy_regen", value: 12.8 })
  })
})

describe("parseRefinementStats", () => {
  test("reports escalation across ranks", () => {
    const ranks = new Map<number, string>([
      [1, "Los PS máximos aumentan un 12%."],
      [2, "Los PS máximos aumentan un 15%."],
      [3, "Los PS máximos aumentan un 18%."],
      [4, "Los PS máximos aumentan un 21%."],
      [5, "Los PS máximos aumentan un 24%."],
    ])

    const result = parseRefinementStats(ranks)

    expect(result.escalates).toBe(true)
    expect(result.stats.get(1)).toEqual({ statId: "hp_percent", value: 12 })
    expect(result.stats.get(5)).toEqual({ statId: "hp_percent", value: 24 })
  })
})

describe("parseEchoBonuses", () => {
  test("reads main slot and conditional bearers", () => {
    const description =
      "Invoca el Mandoble del huracán.<br>El personaje con este Eco equipado en su ranura principal aumenta la Bonif. de Daño Aero en un 10.00%. Si lo equipa en la ranura principal Errante: Aero o Cartethyia, aumenta la Bonif. de Daño Aero en un 10.00% adicional.<br>REU: 20 s"

    const bonuses = parseEchoBonuses(description)

    expect(bonuses).toHaveLength(4)
    expect(bonuses[0]).toMatchObject({
      statId: "aero_dmg",
      value: 10,
      requiresMainSlot: true,
      condition: "none",
    })
    expect(bonuses[1]).toMatchObject({
      condition: "resonator",
      conditionValue: "1406",
    })
    expect(bonuses[2]).toMatchObject({
      condition: "resonator",
      conditionValue: "1408",
    })
    expect(bonuses[3]).toMatchObject({
      condition: "resonator",
      bearer: "cartethyia",
    })
  })

  test("reads the primera ranura grammar with chained stats", () => {
    const description =
      "Transfórmate en Kelpie e inflige un 405.00% de Daño Gelio.<br>Cuando está equipado en la primera ranura, la Bonif. de Daño Gelio del portador aumenta un 12.00% y la Bonif. de Daño Aero un 12.00%."

    const bonuses = parseEchoBonuses(description)

    expect(bonuses).toHaveLength(2)
    expect(bonuses[0]).toMatchObject({ statId: "glacio_dmg", value: 12 })
    expect(bonuses[1]).toMatchObject({ statId: "aero_dmg", value: 12 })
  })

  test("ignores pure damage descriptions", () => {
    expect(
      parseEchoBonuses(
        "Transfórmate en Jefemico Ciclón y golpea a los enemigos, infligiendo un 268.20% de Daño Aero.<br>REU: 15 s"
      )
    ).toHaveLength(0)
  })
})

const CARTETHYIA_HTML = readFileSync(
  join(import.meta.dir, "fixtures", "cartethyia.html"),
  "utf8"
)

describe("prydwen parser", () => {
  test("reads the best weapons of the fixture", () => {
    const lines = htmlToLines(CARTETHYIA_HTML)
    const weapons = parseBestWeapons(lines)

    expect(weapons).toHaveLength(7)
    expect(weapons[0]).toEqual({ name: "Defier's Thorn", rank: 1 })
    expect(weapons[3]).toEqual({ name: "Feather Edge", rank: 5 })
  })

  test("reads the best sets with main echoes", () => {
    const lines = htmlToLines(CARTETHYIA_HTML)
    const sets = parseBestSets(lines)

    expect(sets).toHaveLength(1)
    expect(sets[0]?.name).toBe("Windward Pilgrimage")
    expect(sets[0]?.mainEchoes).toEqual(["Reminiscence: Fleurdelys"])
  })
})

describe("match helpers", () => {
  test("recognizes rover id pairs", () => {
    expect(isRoverPair(1501, 1502)).toBe(true)
    expect(isRoverPair(1502, 1501)).toBe(true)
    expect(isRoverPair(1501, 1603)).toBe(false)
    expect(isRoverPair(1406, 1408)).toBe(true)
  })

  test("resolves the Endless Resonance rename", () => {
    const sonatas = new Map<string, number>([["lingering tunes", 9]])

    expect(matchSonataId({ sonatas } as NameIndex, "Endless Resonance")).toBe(9)
    expect(matchSonataId({ sonatas } as NameIndex, "Lingering Tunes")).toBe(9)
    expect(
      matchSonataId({ sonatas } as NameIndex, "Sierra Gale")
    ).toBeUndefined()
  })
})
