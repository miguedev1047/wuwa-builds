import { createServerFn } from "@tanstack/react-start"
import { idInput } from "../application/schemas"

/**
 * Encore weapon/echo server functions.
 *
 * Detail payloads still contain passthrough game-data arrays (`items`,
 * `damage`) typed as `unknown[]`, so the strict output check is disabled for
 * those two; the values are plain JSON.
 */
export const getWeapons = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readWeapons } = await import("../application/read-catalogs.server")
    return readWeapons()
  }
)

export const getWeapon = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .validator(idInput)
  .handler(async ({ data }) => {
    const { readWeapon } = await import("../application/read-catalogs.server")
    return readWeapon(data.id)
  })

export const getEchoes = createServerFn({ method: "GET" }).handler(async () => {
  const { readEchoes } = await import("../application/read-catalogs.server")
  return readEchoes()
})

export const getEcho = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .validator(idInput)
  .handler(async ({ data }) => {
    const { readEcho } = await import("../application/read-catalogs.server")
    return readEcho(data.id)
  })
