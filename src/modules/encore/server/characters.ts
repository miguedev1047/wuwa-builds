import { createServerFn } from "@tanstack/react-start"
import { idInput } from "../application/schemas"

/**
 * Encore character server functions.
 *
 * Data access lives in `.server.ts` modules, loaded lazily, so the API client
 * and its cache never reach the client bundle.
 */
export const getCharacters = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readCharacters } =
      await import("../application/read-characters.server")
    return readCharacters()
  }
)

/**
 * The lean detail still contains passthrough game-data arrays (`consumes`,
 * `damage`) typed as `unknown[]`, so the strict output check is disabled. The
 * value is plain JSON and serializes fine over the RPC boundary.
 */
export const getCharacter = createServerFn({
  method: "GET",
  strict: { output: false },
})
  .validator(idInput)
  .handler(async ({ data }) => {
    const { readCharacter } =
      await import("../application/read-characters.server")
    return readCharacter(data.id)
  })
