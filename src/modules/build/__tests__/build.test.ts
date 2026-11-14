/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  ECHO_LEVEL_MILESTONES,
  echoLevelFromStep,
  echoStepFromLevel,
  LEVEL_MILESTONES,
  levelFromStep,
  stepFromLevel,
} from "@build/domain/build"

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

describe("echo level milestones", () => {
  test("exposes the 0..25 progression", () => {
    expect(ECHO_LEVEL_MILESTONES).toEqual([0, 5, 10, 15, 20, 25])
  })

  test("maps a 0-based step to the real echo level", () => {
    expect(echoLevelFromStep(0)).toBe(0)
    expect(echoLevelFromStep(1)).toBe(5)
    expect(echoLevelFromStep(5)).toBe(25)
    expect(echoLevelFromStep(99)).toBe(25)
  })

  test("snaps a real echo level down to its milestone step", () => {
    expect(echoStepFromLevel(0)).toBe(0)
    expect(echoStepFromLevel(4)).toBe(0)
    expect(echoStepFromLevel(7)).toBe(1)
    expect(echoStepFromLevel(25)).toBe(5)
  })
})
