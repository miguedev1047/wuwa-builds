import { BACKGROUNDS } from "@/modules/builds/application/backgrounds"
import { BuildWorkspace } from "./build-workspace"
import { Image } from "@/components/ui/image"
import { updateBuild } from "@/modules/builds/client/build-store"
import { useBuilderId } from "../../application/use-builder-id"
import { useSessionId } from "../../../builds/application/build-live-queries"

interface BuildBackgroundsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuildBackgrounds({
  onOpenChange,
  open,
}: BuildBackgroundsProps) {
  const buildId = useBuilderId()
  const sessionId = useSessionId()

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
