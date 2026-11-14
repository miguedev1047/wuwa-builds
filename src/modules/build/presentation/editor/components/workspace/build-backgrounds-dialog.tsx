import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { BACKGROUNDS } from "@build/application/backgrounds"
import { BuildWorkspace } from "./build-workspace"
import { Image } from "@/components/ui/image"
import { updateBuild } from "@build/client/build-store"

interface BuildBackgroundsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuildBackgrounds({
  onOpenChange,
  open,
}: BuildBackgroundsProps) {
  const { buildId, sessionId } = useBuildIdentity()

  const handleSelectBackground = (index: number) => {
    const updated = updateBuild({ buildId, sessionId }, (current) => {
      current.backgroundIndex = index
    })
    if (!updated) return

    onOpenChange(false)
  }

  return (
    <BuildWorkspace.Dialog
      dialogProps={{ open, onOpenChange }}
      title="Fondo de la build"
    >
      {() => (
        <div className="grid grid-cols-4 gap-4">
          {BACKGROUNDS.map((bg, index) => (
            <button key={index} onClick={() => handleSelectBackground(index)}>
              <Image
                role="button"
                aspect="square"
                size="full"
                hover="lift"
                src={bg}
                alt={`background-${index}`}
              />
            </button>
          ))}
        </div>
      )}
    </BuildWorkspace.Dialog>
  )
}
