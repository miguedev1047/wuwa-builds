import type { AppDb } from "@db/create"
import type { EchoSelectionSummary } from "@catalog/domain/echo"

/** Reads selection metadata in a bounded relation query, without full echo details. */
export async function readEchoSelection(
  db: AppDb
): Promise<EchoSelectionSummary[]> {
  return await db.query.echoes.findMany({
    orderBy: { id: "asc" },
    with: {
      sets: {
        columns: { setId: true, name: true, icon: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })
}
