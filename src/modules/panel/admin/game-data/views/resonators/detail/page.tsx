import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { Show } from "@/components/utility/show"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorDeleteDialog } from "@/modules/panel/admin/game-data/views/resonators/detail/components/delete-dialog"
import { ResonatorEditDialog } from "@/modules/panel/admin/game-data/views/resonators/detail/components/edit-dialog"
import { resonatorDetailDockActions } from "@/modules/panel/admin/game-data/views/resonators/detail/dock-actions"
import { ResonatorInfoSection } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/info"

type DetailDialog = "edit" | "delete" | null

export function ResonatorDetailPage() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  const [dialog, setDialog] = useState<DetailDialog>(null)

  const { isPending } = useQuery({
    ...characterQueries.detail(resonatorId),
    enabled: Number.isInteger(resonatorId) && resonatorId > 0,
  })

  const dockActions = useMemo(
    () =>
      resonatorDetailDockActions({
        onEdit: () => setDialog("edit"),
        onDelete: () => setDialog("delete"),
      }),
    []
  )

  return (
    <>
      <ResonatorInfoSection />

      <Show when={!isPending}>
        <CatalogSection.DockActions items={dockActions} />
      </Show>

      <ResonatorEditDialog
        open={dialog === "edit"}
        onOpenChange={(open) => setDialog(open ? "edit" : null)}
      />
      <ResonatorDeleteDialog
        open={dialog === "delete"}
        onOpenChange={(open) => setDialog(open ? "delete" : null)}
      />
    </>
  )
}
