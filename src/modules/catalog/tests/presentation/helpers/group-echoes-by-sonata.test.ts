import { describe, expect, test } from "bun:test"
import type { EchoSelectionSummary } from "@catalog/domain/echo"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"
import { groupEchoesBySonata } from "@catalog/presentation/echoes/list/application/group-echoes-by-sonata"

const date = new Date(0)

function echo(
  id: number,
  sets: readonly (readonly [number, string])[] = []
): EchoSelectionSummary {
  return {
    id,
    name: `Echo ${id}`,
    class: "common",
    cost: 1,
    icon: `${id}.webp`,
    createdAt: date,
    updatedAt: date,
    sets: sets.map(([setId, name]) => ({
      setId,
      name,
      sonata: { icon: `${setId}.webp` },
    })),
  }
}

function sonata(id: number, name: string): SonataCatalogEntry {
  return {
    id,
    name,
    icon: `${id}.webp`,
    color: "",
    source: "encore",
    createdAt: date,
    updatedAt: date,
    effects: [
      {
        id: id * 10,
        setId: id,
        pieces: 2,
        description: `${name} 2p`,
        isConditional: false,
        statId: "atk_percent",
        value: 10,
        sortOrder: 0,
        createdAt: date,
        updatedAt: date,
      },
    ],
  }
}

describe("groupEchoesBySonata", () => {
  test("groups by set and repeats an echo that belongs to several", () => {
    const groups = groupEchoesBySonata(
      [
        echo(1, [
          [10, "Resplandor de la luna"],
          [20, "Rejuvenecimiento"],
        ]),
        echo(2, [[10, "Resplandor de la luna"]]),
        echo(3),
      ],
      [sonata(10, "Resplandor de la luna"), sonata(20, "Rejuvenecimiento")]
    )

    expect(groups.map((group) => group.name)).toEqual([
      "Resplandor de la luna",
      "Rejuvenecimiento",
      "Sin sonata",
    ])
    expect(groups[0].echoes.map((entry) => entry.id)).toEqual([1, 2])
    expect(groups[1].echoes.map((entry) => entry.id)).toEqual([1])
    expect(groups[2].echoes.map((entry) => entry.id)).toEqual([3])
    expect(groups[0].effects).toHaveLength(1)
    expect(groups[2].effects).toEqual([])
  })

  test("falls back to the echo set metadata for a set the catalog lacks", () => {
    const groups = groupEchoesBySonata(
      [echo(1, [[99, "Set manual"]]), echo(2)],
      []
    )

    expect(groups).toHaveLength(2)
    expect(groups[0]).toMatchObject({
      setId: 99,
      name: "Set manual",
      icon: "99.webp",
    })
    expect(groups[0].echoes.map((entry) => entry.id)).toEqual([1])
    expect(groups[1].setId).toBeNull()
  })

  test("skips catalog sets with no echoes", () => {
    const groups = groupEchoesBySonata(
      [echo(1, [[10, "Con ecos"]])],
      [sonata(10, "Con ecos"), sonata(20, "Sin ecos")]
    )

    expect(groups.map((group) => group.name)).toEqual(["Con ecos"])
  })

  test("returns no groups for an empty echo list", () => {
    expect(groupEchoesBySonata([], [sonata(10, "Sin ecos")])).toEqual([])
  })
})
