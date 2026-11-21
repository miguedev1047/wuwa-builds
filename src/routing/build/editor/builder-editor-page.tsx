import { BuildIdentityProvider } from "@build/presentation/editor/build-identity"
import { EditorSectionProvider } from "@build/presentation/editor/state/editor-section-context"
import { BuildEditorWorkspace } from "@build/presentation/editor/components/workspace/build-editor-workspace"
import type { DockLinkItem } from "@/components/ui/dock"
import { ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { linkOptions } from "@tanstack/react-router"
import type { BuildProps } from "@/modules/build/domain/build-record"

const backLink = {
  type: "link",
  label: "Volver",
  icon: <HugeiconsIcon icon={ChevronLeftIcon} />,
  linkOptions: linkOptions({ to: "/panel/my-builds" }),
} satisfies DockLinkItem

interface BuilderEditorPageProps {
  buildId: string
  userId: string
  build: BuildProps
  rename: (name: string) => void
  remove: () => void
}

export function BuilderEditorPage({
  buildId,
  build,
  userId,
  remove,
  rename,
}: BuilderEditorPageProps) {
  const identity = { buildId, userId }

  return (
    <EditorSectionProvider key={buildId}>
      <BuildIdentityProvider identity={identity}>
        <BuildEditorWorkspace
          build={build}
          backLink={backLink}
          onRename={rename}
          onDelete={remove}
        />
      </BuildIdentityProvider>
    </EditorSectionProvider>
  )
}
