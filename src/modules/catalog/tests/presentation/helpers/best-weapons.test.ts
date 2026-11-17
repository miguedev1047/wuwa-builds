import { describe, expect, test } from "bun:test"
import type { WeaponSummary } from "@catalog/domain/weapon"
import { compatibleBestWeaponOptions } from "@catalog/presentation/resonators/detail/application/best-weapons"

function weapon(
  id: number,
  name: string,
  type: WeaponSummary["type"]
): WeaponSummary {
  return {
    id,
    name,
    type,
    rarity: 5,
    icon: "",
    description: "",
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }
}

describe("compatibleBestWeaponOptions", () => {
  test("returns only catalog weapons matching the resonator type", () => {
    expect(
      compatibleBestWeaponOptions(
        [
          weapon(1, "Espada compatible", "sword"),
          weapon(2, "Mandoble", "broadblade"),
          weapon(3, "Otra espada", "sword"),
        ],
        "sword"
      )
    ).toEqual([
      { label: "Espada compatible", value: "1", icon: "" },
      { label: "Otra espada", value: "3", icon: "" },
    ])
  })
})
