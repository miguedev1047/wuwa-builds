import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/functions/middlewares"
import {
  buildIdInputSchema,
  characterGroupInputSchema,
  createBuildInputSchema,
  updateBuildInputSchema,
} from "../application/schemas"

/**
 * Authenticated build server functions.
 *
 * `authMiddleware` resolves the session once per request; the D1 repository is
 * loaded lazily inside each handler so Drizzle never reaches the client.
 */
export const getMyBuilds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")
    return d1BuildRepository.listByUser(context.session.user.id)
  })

export const getMyBuildsByCharacter = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(characterGroupInputSchema)
  .handler(async ({ context, data }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")
    return d1BuildRepository.listByUserAndCharacter(
      context.session.user.id,
      data.characterId
    )
  })

export const getBuild = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(buildIdInputSchema)
  .handler(async ({ context, data }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")
    return d1BuildRepository.getById(context.session.user.id, data.buildId)
  })

export const createBuild = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createBuildInputSchema)
  .handler(async ({ context, data }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")
    return d1BuildRepository.create(context.session.user.id, data)
  })

export const updateBuild = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateBuildInputSchema)
  .handler(async ({ context, data }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")

    return d1BuildRepository.update(context.session.user.id, data.buildId, {
      name: data.name,
      payload: data.payload,
    })
  })

export const deleteBuild = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(buildIdInputSchema)
  .handler(async ({ context, data }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")
    return d1BuildRepository.delete(context.session.user.id, data.buildId)
  })

export const deleteBuildsByCharacter = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(characterGroupInputSchema)
  .handler(async ({ context, data }) => {
    const { d1BuildRepository } =
      await import("../infrastructure/d1/build-repository.server")
    return d1BuildRepository.deleteByCharacter(
      context.session.user.id,
      data.characterId
    )
  })
