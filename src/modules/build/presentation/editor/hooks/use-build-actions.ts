import { useToast } from "@/components/panelui/toast"
import { buildEdits } from "@build/application/build-edits"
import { createEmptyBuild } from "@build/application/factories/build"
import { useBuildStore } from "@build/client/hooks/use-build-store"
import { MAX_BUILDS_PER_USER } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { useState } from "react"

type UseBuildActionsInput = {
  /** User whose collection owns the build. */
  userId: string
  /** Build selected by the editor route. */
  editor?: {
    /** Route id used to scope the snapshot during navigation. */
    buildId: string
    /** Current build from the editor's live query. */
    liveBuild: BuildProps | undefined
  }
}

type BuildActions = {
  /** Creates an empty build and passes its id to the caller after saving. */
  createBlankBuild: (
    onCreated: (buildId: string) => Promise<void>
  ) => Promise<void>
  /** Whether creation or its follow-up navigation is in progress. */
  isCreating: boolean
  /** Build to render: the live one, or the removed one while the route leaves. */
  build: BuildProps | null
  /** Saves a new name on the current build. */
  renameBuild: (name: string) => void
  /** Starts the deletion and leaves the editor. */
  deleteBuild: (onDeleteStarted: () => Promise<void>) => Promise<void>
}

/**
 * Create, rename and delete actions for the signed-in user's builds.
 *
 * Deletion writes to the collection immediately, while the navigation away is
 * still in flight, so the removed document is held in state until the route
 * unmounts instead of rendering the not-found state for a frame.
 */
export function useBuildActions({
  userId,
  editor,
}: UseBuildActionsInput): BuildActions {
  const toast = useToast()
  const {
    count,
    insert,
    update,
    remove: deleteStoredBuild,
  } = useBuildStore(userId)
  const [isCreating, setIsCreating] = useState(false)
  const [leavingBuild, setLeavingBuild] = useState<BuildProps | null>(null)

  const build =
    editor?.liveBuild ??
    (leavingBuild?.buildId === editor?.buildId ? leavingBuild : null)

  const createBlankBuild: BuildActions["createBlankBuild"] = async (
    onCreated
  ) => {
    if (isCreating) return

    if (count() >= MAX_BUILDS_PER_USER) {
      toast.add({ title: "Límite de builds alcanzado", type: "error" })
      return
    }

    setIsCreating(true)
    let saved = false

    try {
      const buildId = crypto.randomUUID()
      const transaction = insert(
        createEmptyBuild({
          buildId,
          userId,
          createdAt: new Date().toISOString(),
        })
      )

      await transaction.when("settled")
      saved = true
      await onCreated(buildId)
    } catch {
      toast.add({
        title: saved
          ? "La build se guardó, pero el editor no pudo abrirse"
          : "No se pudo crear la build",
        type: "error",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const renameBuild = (name: string) => {
    if (!build) return

    update({ buildId: build.buildId, userId: build.userId }, (draft) =>
      buildEdits.rename(draft, name)
    )
  }

  const deleteBuild: BuildActions["deleteBuild"] = async (onDeleteStarted) => {
    if (!editor?.liveBuild || leavingBuild?.buildId === editor.buildId) return

    const { buildId, liveBuild } = editor
    setLeavingBuild(liveBuild)

    try {
      const transaction = deleteStoredBuild({ buildId, userId })
      if (!transaction) throw new Error("Build not found")

      void onDeleteStarted().catch(() => {
        setLeavingBuild(null)
        toast.add({ title: "No se pudo abrir Mis builds", type: "error" })
      })

      await transaction.when("settled")
      toast.add({ title: "Build eliminada", type: "success" })
    } catch {
      setLeavingBuild(null)
      toast.add({ title: "No se pudo eliminar la build", type: "error" })
    }
  }

  return { createBlankBuild, isCreating, build, renameBuild, deleteBuild }
}
