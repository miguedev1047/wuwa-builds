import type { EchoRow } from "@/db/schema"
import type { EncoreEchoDetail } from "@/modules/encore/domain/echo"
import type { EchoInput } from "@/modules/panel/admin/game-data/application/schemas"

/**
 * Fills the admin form with an Encore echo.
 *
 * `class` and `cost` come from the Encore tier (`Rarity`). The star rating is
 * not part of the catalog: Echo drops are the ones that roll it.
 */
export function echoDraftFromEncore(echo: EncoreEchoDetail): EchoInput {
  return {
    id: echo.id,
    name: echo.name,
    class: echo.class,
    cost: echo.cost,
    icon: echo.icon,
  }
}

/** Maps a saved echo row to the edit form values. */
export function echoDraftFromRow(echo: EchoRow): EchoInput {
  return {
    id: echo.id,
    name: echo.name,
    class: echo.class,
    cost: echo.cost,
    icon: echo.icon,
  }
}
