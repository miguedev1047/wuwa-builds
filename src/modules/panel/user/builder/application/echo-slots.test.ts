/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { EchoesDataProps } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import type { EchoSummary } from "@/modules/game-data/domain/echo"
import { selectEchoSlot } from "./echo-slots"

function echo(id: number): EchoSummary {
  return {
    id,
    name: `Echo ${id}`,
    class: 0,
    cost: 1,
    icon: "",
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }
}

function slot(index: number, data: EchoSummary | null = null): EchoesDataProps {
  return {
    data,
    index,
    echoSet: "none",
    mainStatLabel: "none",
    mainStatValue: 0,
    level: 0,
    cost: data?.cost ?? 0,
    substats: [],
  }
}

describe("selectEchoSlot", () => {
  test("assigns an echo to an empty slot", () => {
    const next = selectEchoSlot({
      echoes: [slot(0), slot(1)],
      targetIndex: 1,
      echo: echo(10),
    })

    expect(next[1].data?.id).toBe(10)
    expect(next[1].cost).toBe(1)
  })

  test("clears the main stat and substats when replacing an echo", () => {
    const target = {
      ...slot(0, echo(10)),
      mainStatLabel: "Ataque %",
      mainStatValue: 33,
      substats: [{ index: 0, valueLabel: "Vida", valueNumber: 320 }],
    }
    const next = selectEchoSlot({
      echoes: [target],
      targetIndex: 0,
      echo: echo(20),
    })

    expect(next[0].mainStatLabel).toBe("")
    expect(next[0].mainStatValue).toBe(0)
    expect(next[0].substats[0].valueLabel).toBe("")
    expect(next[0].substats[0].valueNumber).toBe(0)
  })

  test("swaps slots when the echo already belongs to another one", () => {
    const first = echo(10)
    const second = echo(20)
    const next = selectEchoSlot({
      echoes: [slot(0, first), slot(1, second)],
      targetIndex: 1,
      echo: first,
    })

    expect(next[0].data?.id).toBe(20)
    expect(next[1].data?.id).toBe(10)
    expect(next[0].index).toBe(0)
    expect(next[1].index).toBe(1)
  })

  test("ignores an invalid target index", () => {
    const echoes = [slot(0)]

    expect(selectEchoSlot({ echoes, targetIndex: 2, echo: echo(10) })).toBe(
      echoes
    )
  })
})
