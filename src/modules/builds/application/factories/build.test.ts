/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type {
  CharacterDetail,
  CharacterSummary,
} from "@/modules/game-data/domain/character"
import {
  CHARACTER_LEVEL_MAX,
  ECHO_LEVEL_MAX,
  ECHO_SLOT_COUNT,
  SKILL_LEVEL_MAX,
  SUBSTATS_PER_ECHO_MAX,
  WEAPON_LEVEL_MAX,
} from "../../domain/build"
import { createBuildFromCharacter, createEmptyBuild } from "./build"

const character = { id: 42, name: "Cartethyia" } as CharacterSummary

function skill(id: number, skillId: number) {
  return { id, skillId, name: `Skill ${skillId}`, icon: "" }
}

const detail = {
  skills: Array.from({ length: 7 }).map((_, index) =>
    skill(index + 1, 100 + index)
  ),
  passives: [
    {
      id: 1,
      passiveId: 200,
      title: "Passive",
      valueNumber: 8,
      icon: "",
    },
  ],
} as CharacterDetail

describe("createEmptyBuild", () => {
  test("creates a build without resonator, weapon or echoes", () => {
    const build = createEmptyBuild({
      buildId: "build-1",
      sessionId: "session-1",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    expect(build.resonator.data).toBeNull()
    expect(build.resonator.skills).toEqual([])
    expect(build.resonator.passives).toEqual([])
    expect(build.resonator.level).toBe(CHARACTER_LEVEL_MAX)

    expect(build.weapon.data).toBeNull()
    expect(build.weapon.level).toBe(WEAPON_LEVEL_MAX)

    expect(build.echoes).toHaveLength(ECHO_SLOT_COUNT)
    expect(build.echoes.every((echo) => echo.level === ECHO_LEVEL_MAX)).toBe(
      true
    )
    expect(
      build.echoes.every(
        (echo) => echo.substats.length === SUBSTATS_PER_ECHO_MAX
      )
    ).toBe(true)
  })

  test("gives each echo its own substat array", () => {
    const build = createEmptyBuild({
      buildId: "build-1",
      sessionId: "session-1",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    expect(build.echoes[0].substats).not.toBe(build.echoes[1].substats)
  })
})

describe("createBuildFromCharacter", () => {
  test("seeds resonator skills and passives from the detail", () => {
    const build = createBuildFromCharacter({
      buildId: "build-1",
      sessionId: "session-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      character,
      detail,
    })

    expect(build.resonator.data).toBe(character)
    expect(build.resonator.skills).toHaveLength(detail.skills.length)
    expect(
      build.resonator.skills.every((item) => item.level === SKILL_LEVEL_MAX)
    ).toBe(true)
    expect(build.resonator.passives.length).toBeGreaterThan(0)
    expect(build.weapon.data).toBeNull()
  })
})
