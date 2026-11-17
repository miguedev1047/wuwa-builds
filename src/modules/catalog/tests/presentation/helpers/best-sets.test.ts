import { describe, expect, test } from "bun:test"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"
import { bestSetOptions } from "@catalog/presentation/resonators/detail/application/best-sets"

function sonata(id: number, name: string, icon: string): SonataCatalogEntry {
  return {
    id,
    name,
    icon,
    color: "",
    source: "encore",
    createdAt: new Date(0),
    updatedAt: new Date(0),
    effects: [],
  }
}

describe("bestSetOptions", () => {
  test("maps catalog Sonata sets to options and carries their icons", () => {
    expect(
      bestSetOptions([
        sonata(1, "Brillo lunar", "moon.webp"),
        sonata(2, "Eco persistente", ""),
      ])
    ).toEqual([
      { label: "Brillo lunar", value: "1", icon: "moon.webp" },
      { label: "Eco persistente", value: "2", icon: "" },
    ])
  })
})
