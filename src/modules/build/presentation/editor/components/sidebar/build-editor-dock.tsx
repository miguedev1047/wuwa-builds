import { ActionDock } from "@/components/blocks/action-dock"
import type { DockItemData, DockLinkItem } from "@/components/ui/dock"
import { BuildDelete } from "@build/presentation/editor/components/sidebar/build-delete"
import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { updateBuild } from "@build/client/build-store"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import {
  ColorsIcon,
  DeleteIcon,
  DownloadIcon,
  LayerIcon,
  SwordIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

const sections = [
  { title: "Resonador", id: "resonator", icon: UserIcon },
  { title: "Arma", id: "weapon", icon: SwordIcon },
  { title: "Ecos", id: "echo", icon: LayerIcon },
  { title: "Apariencia", id: "appareance", icon: ColorsIcon },
] as const

type BuildEditorDockProps = {
  /** Route-owned link back to the build collection. */
  backLink: DockLinkItem
  /** Whether the current build has enough data to export. */
  canDownload: boolean
  /** Whether the export operation is in progress. */
  isDownloading: boolean
  /** Starts exporting the current build. */
  onDownload: () => void
  /** Deletes the current build after confirmation. */
  onDelete: () => void
  /** Opens the selected section's inspector on mobile. */
  onSectionSelect: () => void
}

/** Navigation and frequent actions for the active build. */
export function BuildEditorDock({
  backLink,
  canDownload,
  isDownloading,
  onDownload,
  onDelete,
  onSectionSelect,
}: BuildEditorDockProps) {
  const { buildId, userId } = useBuildIdentity()
  const { data: build } = useBuildCollection({ buildId, userId })
  const [deleteOpen, setDeleteOpen] = useState(false)

  const items: DockItemData[] = [
    backLink,
    { separator: true },
    ...sections.map((section) => ({
      label: section.title,
      icon: <HugeiconsIcon icon={section.icon} />,
      active: section.id === build?.selectedEditorSection,
      onClick: () => {
        updateBuild({ buildId, userId }, (current) => {
          current.selectedEditorSection = section.id
        })
        onSectionSelect()
      },
    })),
    { separator: true },
    {
      label: isDownloading ? "Exportando" : "Exportar",
      icon: <HugeiconsIcon icon={DownloadIcon} />,
      disabled: !canDownload || isDownloading,
      onClick: onDownload,
    },
    {
      label: "Eliminar",
      icon: <HugeiconsIcon icon={DeleteIcon} />,
      className: "text-destructive",
      onClick: () => setDeleteOpen(true),
    },
  ]

  return (
    <>
      <ActionDock
        items={items}
        ariaLabel="Navegación y acciones de la build"
        mode="absolute"
      />
      <BuildDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={onDelete}
      />
    </>
  )
}
