import { useToast } from "@/components/panelui/toast"
import type { useBuildStats } from "@/modules/build/client/hooks/use-build-stats"
import type { BuildProps } from "@/modules/build/domain/build-record"
import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import { downloadBuildPng } from "./download-build-png"

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
  const toast = useToast()
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
      toast.add({
        title: "No se pudo descargar la imagen de la build",
        type: "error",
      })
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
