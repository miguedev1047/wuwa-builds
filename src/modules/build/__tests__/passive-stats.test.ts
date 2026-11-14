/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { passiveStatId } from "@build/application/calculation/passive-stats"

describe("passiveStatId", () => {
  test("maps the stat passive titles used by the builder", () => {
    expect(passiveStatId("PS+")).toBe("hp_percent")
    expect(passiveStatId("Prob. CRIT+")).toBe("crit_rate")
    expect(passiveStatId("ATQ+")).toBe("atk_percent")
    expect(passiveStatId("Daño CRIT+")).toBe("crit_dmg")
    expect(passiveStatId("Daño Aero+")).toBe("aero_dmg")
  })

  test("trims and collapses whitespace", () => {
    expect(passiveStatId("  PS+  ")).toBe("hp_percent")
    expect(passiveStatId("Prob.   CRIT+")).toBe("crit_rate")
  })

  test("returns null for named or unknown passives", () => {
    expect(passiveStatId("Corazón que teje anhelos")).toBeNull()
    expect(passiveStatId("Viento que graba marcas")).toBeNull()
    expect(passiveStatId("Pasiva inventada")).toBeNull()
  })
})
