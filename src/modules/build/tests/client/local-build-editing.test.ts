/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { characterDetail } from "@build/tests/fixtures/catalog-fixtures"
import { createEmptyBuild } from "@build/application/factories/build"
import {
  buildCollection,
  countUserBuilds,
  deleteBuild,
  insertBuild,
  updateBuild,
} from "@build/client/build-store"
import { selectLocalResonator } from "@build/client/select-local-resonator"

const first = characterDetail({ id: 1, name: "Cartethyia" })
const second = characterDetail({ id: 2, name: "Jinhsi" })

function insertDraft(userId = "owner") {
  const identity = { buildId: crypto.randomUUID(), userId }
  insertBuild(
    createEmptyBuild({ ...identity, createdAt: "2026-01-01T00:00:00Z" })
  )
  return identity
}

describe("local build editing", () => {
  test("keeps a build when the same user signs in again", async () => {
    await buildCollection.preload()
    const identity = insertDraft("returning-user")

    // A new sign-in rotates the session id, but ownership is the user id.
    expect(countUserBuilds("returning-user")).toBe(1)
    expect(countUserBuilds("other-user")).toBe(0)

    deleteBuild(identity)
    expect(countUserBuilds("returning-user")).toBe(0)
  })

  test("rejects updates and deletions from another user", async () => {
    await buildCollection.preload()
    const identity = insertDraft()
    const outsider = { ...identity, userId: "other-user" }

    expect(
      updateBuild(outsider, () => {
        throw new Error("Unexpected update")
      })
    ).toBe(false)
    expect(deleteBuild(outsider)).toBe(false)
    expect(buildCollection.get(identity.buildId)?.name).toBe("Nueva build")
    expect(deleteBuild(identity)).toBe(true)
  })

  test("uses the latest resonator selection and preserves the name on replacement", async () => {
    await buildCollection.preload()
    const identity = insertDraft()
    const slowDetail = Promise.withResolvers<typeof first>()
    const pending = selectLocalResonator(
      identity,
      first,
      () => slowDetail.promise
    )

    expect(
      await selectLocalResonator(identity, second, async () => second)
    ).toBe("selected")
    slowDetail.resolve(first)
    expect(await pending).toBe("discarded")
    expect(buildCollection.get(identity.buildId)?.resonator.data?.id).toBe(
      second.id
    )
    expect(buildCollection.get(identity.buildId)?.name).toBe("Build de Jinhsi")

    updateBuild(identity, (draft) => {
      draft.name = "My build"
    })
    expect(await selectLocalResonator(identity, first, async () => first)).toBe(
      "selected"
    )
    expect(buildCollection.get(identity.buildId)?.name).toBe("My build")
    deleteBuild(identity)
  })

  test("preserves a custom name on first selection and discards a selection after deletion", async () => {
    await buildCollection.preload()
    const identity = insertDraft()
    updateBuild(identity, (draft) => {
      draft.name = "My build"
    })
    expect(await selectLocalResonator(identity, first, async () => first)).toBe(
      "selected"
    )
    expect(buildCollection.get(identity.buildId)?.name).toBe("My build")

    const slowDetail = Promise.withResolvers<typeof second>()
    const pending = selectLocalResonator(
      identity,
      second,
      () => slowDetail.promise
    )
    deleteBuild(identity)
    slowDetail.resolve(second)
    expect(await pending).toBe("discarded")
    expect(buildCollection.get(identity.buildId)).toBeUndefined()
  })
})
