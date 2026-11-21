/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { characterDetail } from "@build/tests/fixtures/catalog-fixtures"
import { createEmptyBuild } from "@build/application/factories/build"
import {
  countUserBuilds,
  deleteBuild,
  insertBuild,
  updateBuild,
  type BuildDraftCollection,
} from "@build/client/build-store"
import { selectLocalResonator } from "@build/client/select-local-resonator"
import type { BuildProps } from "@build/domain/build-record"

const first = characterDetail({ id: 1, name: "Cartethyia" })
const second = characterDetail({ id: 2, name: "Jinhsi" })

function createFakeCollection(): BuildDraftCollection {
  const rows = new Map<string, BuildProps>()

  return {
    get: (key) => rows.get(key),
    values: () => rows.values(),
    insert: (build) => {
      rows.set(build.buildId, structuredClone(build))
      return { when: async () => undefined }
    },
    update: (key, updater) => {
      const current = rows.get(key)
      if (!current) throw new Error("Missing build")

      const draft = structuredClone(current)
      updater(draft)
      rows.set(key, draft)
    },
    delete: (key) => {
      rows.delete(key)
      return { when: async () => undefined }
    },
  }
}

function insertDraft(collection: BuildDraftCollection, userId = "owner") {
  const identity = { buildId: crypto.randomUUID(), userId }
  insertBuild(
    collection,
    createEmptyBuild({ ...identity, createdAt: "2026-01-01T00:00:00Z" })
  )
  return identity
}

describe("build editing", () => {
  test("keeps a build when the same user signs in again", () => {
    const collection = createFakeCollection()
    const identity = insertDraft(collection, "returning-user")

    // A new sign-in rotates the session id, but ownership is the user id.
    expect(countUserBuilds(collection, "returning-user")).toBe(1)
    expect(countUserBuilds(collection, "other-user")).toBe(0)

    deleteBuild(collection, identity)
    expect(countUserBuilds(collection, "returning-user")).toBe(0)
  })

  test("rejects updates and deletions from another user", () => {
    const collection = createFakeCollection()
    const identity = insertDraft(collection)
    const outsider = { ...identity, userId: "other-user" }

    expect(
      updateBuild(collection, outsider, () => {
        throw new Error("Unexpected update")
      })
    ).toBe(false)
    expect(deleteBuild(collection, outsider)).toBe(false)
    expect(collection.get(identity.buildId)?.name).toBe("Nueva build")
    expect(deleteBuild(collection, identity)).toBeTruthy()
  })

  test("uses the latest resonator selection and preserves the name on replacement", async () => {
    const collection = createFakeCollection()
    const identity = insertDraft(collection)
    const slowDetail = Promise.withResolvers<typeof first>()
    const pending = selectLocalResonator(
      collection,
      identity,
      first,
      () => slowDetail.promise
    )

    expect(
      await selectLocalResonator(
        collection,
        identity,
        second,
        async () => second
      )
    ).toBe("selected")
    slowDetail.resolve(first)
    expect(await pending).toBe("discarded")
    expect(collection.get(identity.buildId)?.resonator.data?.id).toBe(second.id)
    expect(collection.get(identity.buildId)?.name).toBe("Build de Jinhsi")

    updateBuild(collection, identity, (draft) => {
      draft.name = "My build"
    })
    expect(
      await selectLocalResonator(collection, identity, first, async () => first)
    ).toBe("selected")
    expect(collection.get(identity.buildId)?.name).toBe("My build")
    deleteBuild(collection, identity)
  })

  test("preserves a custom name on first selection and discards a selection after deletion", async () => {
    const collection = createFakeCollection()
    const identity = insertDraft(collection)
    updateBuild(collection, identity, (draft) => {
      draft.name = "My build"
    })
    expect(
      await selectLocalResonator(collection, identity, first, async () => first)
    ).toBe("selected")
    expect(collection.get(identity.buildId)?.name).toBe("My build")

    const slowDetail = Promise.withResolvers<typeof second>()
    const pending = selectLocalResonator(
      collection,
      identity,
      second,
      () => slowDetail.promise
    )
    deleteBuild(collection, identity)
    slowDetail.resolve(second)
    expect(await pending).toBe("discarded")
    expect(collection.get(identity.buildId)).toBeUndefined()
  })
})
