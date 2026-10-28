import { createServerFn } from "@tanstack/react-start"
import {
  buildIdInputSchema,
  createBuildInputSchema,
  resonatorGroupInputSchema,
  updateBuildInputSchema,
} from "../application/schemas"

/**
 * Authenticated build server functions.
 *
 * `context.server` is loaded lazily inside each handler, so auth, D1, and
 * Drizzle never reach the client bundle.
 */
export const getMyBuilds = createServerFn({ method: "GET" }).handler(
  async () => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()
    return repository.listByUser(userId)
  }
)

export const getMyBuildsByResonator = createServerFn({ method: "GET" })
  .validator(resonatorGroupInputSchema)
  .handler(async ({ data }) => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()
    return repository.listByUserAndResonator(userId, data.resonatorSlug)
  })

export const getBuild = createServerFn({ method: "GET" })
  .validator(buildIdInputSchema)
  .handler(async ({ data }) => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()
    return repository.getById(userId, data.buildId)
  })

export const createBuild = createServerFn({ method: "POST" })
  .validator(createBuildInputSchema)
  .handler(async ({ data }) => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()
    return repository.create(userId, data)
  })

export const updateBuild = createServerFn({ method: "POST" })
  .validator(updateBuildInputSchema)
  .handler(async ({ data }) => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()

    return repository.update(userId, data.buildId, {
      name: data.name,
      payload: data.payload,
    })
  })

export const deleteBuild = createServerFn({ method: "POST" })
  .validator(buildIdInputSchema)
  .handler(async ({ data }) => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()
    return repository.delete(userId, data.buildId)
  })

export const deleteBuildsByResonator = createServerFn({ method: "POST" })
  .validator(resonatorGroupInputSchema)
  .handler(async ({ data }) => {
    const { buildContext } = await import("./context.server")
    const { userId, repository } = await buildContext()
    return repository.deleteByResonator(userId, data.resonatorSlug)
  })
