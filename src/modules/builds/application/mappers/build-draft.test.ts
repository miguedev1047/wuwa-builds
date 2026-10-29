/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import type { BuildRecord } from "../ports/build-repository"
import { buildPayloadSchema, createEmptyBuildPayload } from "../../domain/build"
import { createEmptyBuildDraft } from "../../domain/build-draft"
import {
  buildDraftToCreateInput,
  buildDraftToUpdateInput,
  buildRecordToDraft,
} from "./build-draft"

const now = new Date("2026-01-01T00:00:00.000Z")

function record(overrides: Partial<BuildRecord> = {}): BuildRecord {
  return {
    id: "build-1",
    userId: "user-1",
    characterId: 1210,
    name: "Tower",
    payload: createEmptyBuildPayload(),
    documentVersion: 1,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

describe("build drafts", () => {
  test("empty drafts use independent nested objects", () => {
    const first = createEmptyBuildDraft({
      id: "a",
      characterId: 1210,
      createdAt: now.toISOString(),
    })
    const second = createEmptyBuildDraft({
      id: "b",
      characterId: 1210,
      createdAt: now.toISOString(),
    })

    first.payload.echoLoadout[0].substats.push({
      statId: "crit_rate",
      value: 6.3,
    })

    expect(second.payload.echoLoadout[0].substats).toHaveLength(0)
    expect(first.payload.echoLoadout[1]).not.toBe(first.payload.echoLoadout[0])
  })

  test("record -> draft keeps the numeric character id", () => {
    const draft = buildRecordToDraft(record())

    expect(draft.characterId).toBe(1210)
    expect(draft.savedBuildId).toBe("build-1")
    expect(draft.documentVersion).toBe(1)
  })

  test("create input strips local metadata", () => {
    const draft = createEmptyBuildDraft({
      id: "a",
      characterId: 1210,
      createdAt: now.toISOString(),
      name: "Tower",
    })

    const input = buildDraftToCreateInput(draft)

    expect(input).toEqual({
      characterId: 1210,
      name: "Tower",
      payload: draft.payload,
    })
    expect("id" in input).toBe(false)
    expect("savedBuildId" in input).toBe(false)
  })

  test("update input requires a saved build", () => {
    const draft = buildRecordToDraft(record())
    const input = buildDraftToUpdateInput(draft)

    expect(input.buildId).toBe("build-1")
    expect(input.payload).toEqual(draft.payload)
  })

  test("unsupported document versions are rejected", () => {
    expect(() => buildRecordToDraft(record({ documentVersion: 2 }))).toThrow(
      "Unsupported build document version"
    )
  })

  test("payload validation rejects out-of-range levels", () => {
    const payload = createEmptyBuildPayload()

    expect(() =>
      buildPayloadSchema.parse({
        ...payload,
        resonator: { ...payload.resonator, level: 0 },
      })
    ).toThrow()
  })
})
