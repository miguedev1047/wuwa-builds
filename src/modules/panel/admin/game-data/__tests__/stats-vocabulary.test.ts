/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { STAT_KINDS, STAT_LABELS, STAT_KEYS } from "@builds/domain/stats"
import {
  STAT_OPTIONS,
  isStatId,
  statLabel,
} from "@game-data/application/stats/stats"
import {
  ELEMENT_BY_ENCORE,
  ELEMENT_IDS,
  RESONATOR_ELEMENTS,
  RESONATOR_PROPERTY_OPTIONS,
  RESONATOR_WEAPON_TYPES,
  WEAPON_TYPE_BY_ENCORE,
  WEAPON_TYPE_IDS,
} from "@game-data/application/constants/resonator"
import {
  WEAPON_PROPERTY_ALIASES,
  WEAPON_PROPERTY_OPTIONS,
  isWeaponPropertyStatId,
} from "@game-data/application/constants/weapon"

describe("stat vocabulary", () => {
  test("every option points to a stat the builder knows", () => {
    for (const option of STAT_OPTIONS) {
      expect(STAT_KINDS[option.value]).toBeDefined()
    }
  })

  test("option ids and labels are unique", () => {
    const ids = STAT_OPTIONS.map((option) => option.value)
    const labels = STAT_OPTIONS.map((option) => option.label)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(labels).size).toBe(labels.length)
  })

  test("statLabel resolves every canonical id", () => {
    for (const id of STAT_KEYS) {
      expect(statLabel(id)).toBe(STAT_LABELS[id])
    }
  })

  test("isStatId accepts ids and rejects labels", () => {
    for (const id of STAT_KEYS) {
      expect(isStatId(id)).toBe(true)
    }

    expect(isStatId("Ataque")).toBe(false)
    expect(isStatId(null)).toBe(false)
  })

  test("weapon property options and aliases use canonical ids", () => {
    for (const option of WEAPON_PROPERTY_OPTIONS) {
      expect(isStatId(option.value)).toBe(true)
    }

    for (const alias of WEAPON_PROPERTY_ALIASES) {
      expect(isStatId(alias.statId)).toBe(true)
    }

    expect(isWeaponPropertyStatId("atk_percent")).toBe(true)
    expect(isWeaponPropertyStatId("Ataque %")).toBe(false)
  })

  test("element and weapon type aliases cover every option", () => {
    for (const option of RESONATOR_ELEMENTS) {
      expect(ELEMENT_IDS).toContain(option.value)
      expect(Object.values(ELEMENT_BY_ENCORE)).toContain(option.value)
    }

    for (const option of RESONATOR_WEAPON_TYPES) {
      expect(WEAPON_TYPE_IDS).toContain(option.value)
      expect(Object.values(WEAPON_TYPE_BY_ENCORE)).toContain(option.value)
    }

    for (const option of RESONATOR_PROPERTY_OPTIONS) {
      expect(isStatId(option.value)).toBe(true)
    }
  })
})
