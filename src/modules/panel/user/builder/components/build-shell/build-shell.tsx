import { useBuildCollection } from "../../../builds/application/build-live-queries"
import { useBuilderId } from "../../application/use-builder-id"
import { BuildContent } from "./build-content"
import { BuildHeader } from "./build-header"

export function BuildShell() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  if (!build) return null

  return (
    <div className="flex h-screen w-full flex-col gap-6 overflow-hidden p-6">
      <BuildHeader />
      <BuildContent />
    </div>
  )
}
