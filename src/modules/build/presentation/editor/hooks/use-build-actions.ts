import { buildEdits } from "@build/application/build-edits"
import { deleteBuild, updateBuild } from "@build/client/build-store"
import type { BuildProps } from "@build/domain/build-record"
import { useState } from "react"

type UseBuildActionsInput = {
  /** Build read by the live query; `undefined` when it does not exist. */
  liveBuild: BuildProps | undefined
  /** Build id of the route, so a leftover snapshot never leaks to another one. */
  buildId: string
  /** Runs after the build is removed, usually the navigation back to the library. */
  onDeleted: () => void | Promise<void>
}

type BuildActions = {
  /** Build to render: the live one, or the removed one while the route leaves. */
  build: BuildProps | null
  /** Saves a new name on the current build. */
  rename: (name: string) => void
  /** Removes the build and keeps it on screen until `onDeleted` settles. */
  remove: () => void
}

/**
 * Rename and delete actions of the editor.
 *
 * Deletion writes to the collection immediately, while the navigation away is
 * still in flight, so the removed document is held in state until the route
 * unmounts instead of rendering the not-found state for a frame.
 */
export function useBuildActions({
  liveBuild,
  buildId,
  onDeleted,
}: UseBuildActionsInput): BuildActions {
  const [leavingBuild, setLeavingBuild] = useState<BuildProps | null>(null)
  const build =
    liveBuild ?? (leavingBuild?.buildId === buildId ? leavingBuild : null)

  const rename = (name: string) => {
    if (!build) return

    updateBuild({ buildId: build.buildId, userId: build.userId }, (draft) =>
      buildEdits.rename(draft, name)
    )
  }

  const remove = () => {
    if (!build) return

    const identity = { buildId: build.buildId, userId: build.userId }
    setLeavingBuild(build)

    if (!deleteBuild(identity)) {
      setLeavingBuild(null)
      return
    }

    void Promise.resolve(onDeleted()).catch(() => setLeavingBuild(null))
  }

  return { build, rename, remove }
}
