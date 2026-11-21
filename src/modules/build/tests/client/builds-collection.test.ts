/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import {
  buildsCollection,
  type BuildSaveInput,
  type BuildsSource,
} from "@build/client/builds-collection"
import {
  buildToPayload,
  payloadToBuild,
} from "@build/application/build-document"
import { BUILD_DOCUMENT_VERSION } from "@build/domain/build"
import type { BuildRecord } from "@build/application/ports/build-repository"
import type { BuildProps } from "@build/domain/build-record"
import { buildRecord } from "@build/tests/fixtures/catalog-fixtures"
import { DbClient } from "@tanstack/react-db"
import { QueryClient } from "@tanstack/react-query"

const userId = "user-1"

function recordFrom(input: BuildSaveInput): BuildRecord {
  return {
    id: input.buildId,
    userId,
    characterId: input.characterId,
    name: input.name,
    payload: input.payload,
    documentVersion: BUILD_DOCUMENT_VERSION,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-02T00:00:00Z"),
  }
}

function setup(initial: BuildProps[], waitForUpdate?: () => Promise<void>) {
  const remote = new Map(
    initial.map((build) => [build.buildId, structuredClone(build)])
  )
  const calls = { create: 0, update: 0, remove: 0 }
  let lastUpdate: BuildSaveInput | null = null

  const persist = (input: BuildSaveInput) => {
    const record = recordFrom(input)
    const build = payloadToBuild({
      record,
      catalog: {
        character: null,
        detail: null,
        weapon: null,
        echoes: new Map(),
      },
    })
    remote.set(input.buildId, build)
    return record
  }

  const source: BuildsSource = {
    list: async () =>
      [...remote.values()].map((build) => structuredClone(build)),
    create: async (input) => {
      calls.create += 1
      return persist(input)
    },
    update: async (input) => {
      calls.update += 1
      await waitForUpdate?.()
      lastUpdate = input
      return persist(input)
    },
    remove: async (buildId) => {
      calls.remove += 1
      return remote.delete(buildId)
    },
  }

  const dbClient = new DbClient({ queryClient: new QueryClient() })
  const collection = dbClient.collection(buildsCollection(userId, source))

  return { dbClient, collection, calls, lastUpdate: () => lastUpdate }
}

describe("builds query collection", () => {
  test("hydrates the source rows on preload", async () => {
    const { dbClient, collection } = setup([buildRecord()])

    expect(dbClient.collection(buildsCollection(userId))).toBe(collection)

    await collection.preload()

    expect(collection.get("build-1")?.name).toBe("Build")
  })

  test("renames optimistically and reconciles with the saved record", async () => {
    const { collection, calls, lastUpdate } = setup([buildRecord()])
    await collection.preload()

    const transaction = collection.update("build-1", (draft) => {
      draft.name = "Renamed"
      draft.updateAt = "2026-02-01T00:00:00.000Z"
    })

    expect(collection.get("build-1")?.name).toBe("Renamed")
    await transaction.when("settled")

    expect(calls.update).toBe(1)
    expect(lastUpdate()?.name).toBe("Renamed")
    expect(collection.get("build-1")?.updateAt).toBe("2026-01-02T00:00:00.000Z")
  })

  test("starts the first write immediately and persists rapid edits in order", async () => {
    const firstWrite = Promise.withResolvers<void>()
    const { collection, calls, lastUpdate } = setup(
      [buildRecord()],
      () => firstWrite.promise
    )
    await collection.preload()

    const first = collection.update("build-1", (draft) => {
      draft.name = "A"
    })
    const second = collection.update("build-1", (draft) => {
      draft.name = "B"
    })

    expect(collection.get("build-1")?.name).toBe("B")
    await Promise.resolve()
    expect(calls.update).toBe(1)

    firstWrite.resolve()
    await Promise.all([first.when("settled"), second.when("settled")])

    expect(calls.update).toBe(2)
    expect(lastUpdate()?.name).toBe("B")
    expect(collection.get("build-1")?.name).toBe("B")
  })

  test("creates and removes through the source handlers", async () => {
    const { collection, calls } = setup([])
    await collection.preload()

    const inserted = buildRecord({ buildId: "build-2" })
    const insert = collection.insert(inserted)
    await insert.when("settled")

    expect(calls.create).toBe(1)
    expect(collection.get("build-2")?.name).toBe(inserted.name)

    const removed = collection.delete("build-2")
    await removed.when("settled")

    expect(calls.remove).toBe(1)
    expect(collection.get("build-2")).toBeUndefined()
  })

  test("sends the normalized payload, not the display document", async () => {
    const { collection, lastUpdate } = setup([buildRecord()])
    await collection.preload()

    const transaction = collection.update("build-1", (draft) => {
      draft.backgroundIndex = 3
    })
    await transaction.when("settled")

    expect(lastUpdate()?.payload.backgroundIndex).toBe(3)
    expect(lastUpdate()?.payload.resonator.passives).toEqual([])
    expect(buildToPayload(collection.get("build-1")!)).toEqual(
      lastUpdate()!.payload
    )
  })
})
