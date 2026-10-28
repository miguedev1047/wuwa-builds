import { createServerFn } from "@tanstack/react-start"
import { echoLookup, echoSetLookup, weaponLookup } from "../application/schemas"

/**
 * Server functions for the shared catalogs (weapons, echoes, echo sets).
 *
 * Same pattern as `resonators.ts`: implementations live in `.server.ts`
 * modules and are loaded lazily inside each handler.
 */

export const getWeapons = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readWeaponCatalog } =
      await import("../application/read-catalogs.server")
    return readWeaponCatalog()
  }
)

export const getWeapon = createServerFn({ method: "GET" })
  .validator(weaponLookup)
  .handler(async ({ data }) => {
    const { readWeapon } = await import("../application/read-catalogs.server")
    return readWeapon(data)
  })

export const getEchoes = createServerFn({ method: "GET" }).handler(async () => {
  const { readEchoCatalog } =
    await import("../application/read-catalogs.server")
  return readEchoCatalog()
})

export const getEcho = createServerFn({ method: "GET" })
  .validator(echoLookup)
  .handler(async ({ data }) => {
    const { readEcho } = await import("../application/read-catalogs.server")
    return readEcho(data)
  })

export const getEchoSets = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readEchoSetCatalog } =
      await import("../application/read-catalogs.server")
    return readEchoSetCatalog()
  }
)

export const getEchoSet = createServerFn({ method: "GET" })
  .validator(echoSetLookup)
  .handler(async ({ data }) => {
    const { readEchoSet } = await import("../application/read-catalogs.server")
    return readEchoSet(data)
  })
