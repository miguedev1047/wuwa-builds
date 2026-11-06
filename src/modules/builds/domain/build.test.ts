/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { LEVEL_MILESTONES, levelFromStep, stepFromLevel } from "./build"

describe("level milestones", () => {
  test("exposes the 1 + tens progression", () => {
    expect(LEVEL_MILESTONES).toEqual([1, 10, 20, 30, 40, 50, 60, 70, 80, 90])
  })

  test("maps a 0-based step to the real level", () => {
    expect(levelFromStep(0)).toBe(1)
    expect(levelFromStep(1)).toBe(10)
    expect(levelFromStep(9)).toBe(90)
    expect(levelFromStep(99)).toBe(90)
  })

  test("snaps a real level down to its milestone step", () => {
    expect(stepFromLevel(1)).toBe(0)
    expect(stepFromLevel(9)).toBe(0)
    expect(stepFromLevel(10)).toBe(1)
    expect(stepFromLevel(45)).toBe(4)
    expect(stepFromLevel(90)).toBe(9)
  })
})
