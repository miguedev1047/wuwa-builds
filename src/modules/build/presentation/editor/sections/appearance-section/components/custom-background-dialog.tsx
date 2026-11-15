import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { updateBuild } from "@build/client/build-store"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { Image } from "@/components/ui/image"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type CustomBackgroundDialogProps = {
  activeBackground: string
  activeBackgroundUrl?: string | null
}

/** Dialog to preview and apply a custom build background from an image URL. */
export function CustomBackgroundDialog({
  activeBackground,
  activeBackgroundUrl,
}: CustomBackgroundDialogProps) {
  const [url, setUrl] = useState("")
  const [open, setOpen] = useState(false)
  const { buildId, sessionId } = useBuildIdentity()
  const validUrl = isWebUrl(url)

  const applyBackground = () => {
    if (!validUrl) return
    updateBuild({ buildId, sessionId }, (build) => {
      build.backgroundUrl = url.trim()
      build.backgroundIndex = null
    })
    setOpen(false)
    setUrl("")
  }

  return (
    <BuildWorkspace.Dialog
      title="Fondo personalizado"
      description="Pega la URL de una imagen para usarla como fondo."
      dialogProps={{
        open,
        onOpenChange: (nextOpen) => {
          if (nextOpen) setUrl(activeBackgroundUrl ?? "")
          setOpen(nextOpen)
        },
      }}
      triggerComponent={
        <button
          type="button"
          aria-label="Cambiar a un fondo personalizado"
          className="group/image relative overflow-hidden rounded-lg border-2 border-transparent transition-colors hover:border-brand-accent"
        >
          <Image
            src={activeBackground}
            alt="Fondo actual"
            background="accent"
            aspect="square"
            className="size-full"
          />
          <div className="absolute inset-0 grid place-content-center opacity-0 transition duration-200 ease-in-out group-hover/image:bg-black/50 group-hover/image:opacity-100">
            <HugeiconsIcon icon={PlusIcon} />
          </div>
        </button>
      }
    >
      {({ close }) => (
        <div className="space-y-4">
          <Input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://ejemplo.com/fondo.webp"
            aria-label="URL de imagen"
          />
          <div className="overflow-hidden rounded-lg border bg-muted">
            <Image
              src={validUrl ? url.trim() : activeBackground}
              alt={validUrl ? "Vista previa del fondo" : "Fondo actual"}
              aspect="square"
              size="full"
              className="max-h-72 w-full"
            />
          </div>
          <Button
            type="button"
            className="w-full"
            disabled={!validUrl}
            onClick={() => {
              applyBackground()
              close()
            }}
          >
            Usar este fondo
          </Button>
        </div>
      )}
    </BuildWorkspace.Dialog>
  )
}

function isWebUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}
