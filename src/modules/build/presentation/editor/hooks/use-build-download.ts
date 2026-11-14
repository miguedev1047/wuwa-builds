import { useRef, useState } from "react"
import { downloadBuildPng } from "./download-build-png"
import type { useBuildStats } from "@/modules/build/client/hooks/use-build-stats"
import type { BuildProps } from "@/modules/build/domain/build-record"
import { flushSync } from "react-dom"
import { toast } from "sonner"

type PreviewBuildProps = ReturnType<typeof useBuildStats>

interface useDownloadBuildProps {
  preview: PreviewBuildProps
  build: BuildProps
}

interface SnapshotDataProps {
  build: BuildProps
  preview: PreviewBuildProps
}

export function useDownloadBuild({ preview, build }: useDownloadBuildProps) {
  const [exportSnapshot, setExportSnapshot] =
    useState<SnapshotDataProps | null>(null)

  const captureRef = useRef<HTMLDivElement>(null)
  const canDownload =
    !!preview.resonator &&
    !!preview.result &&
    !preview.isLoading &&
    !preview.isError

  const handleDownload = async () => {
    if (!canDownload || captureRef.current) return

    try {
      flushSync(() => setExportSnapshot({ build, preview }))
      const card = captureRef.current
      if (!card) throw new Error("Export card did not mount")
      await downloadBuildPng(card, build.name)
    } catch (err) {
      toast.error("No se pudo descargar la imagen de la build")
      console.log(err)
    } finally {
      setExportSnapshot(null)
    }
  }

  return {
    canDownload,
    captureRef,
    exportSnapshot,
    handleDownload,
    setExportSnapshot,
  }
}
