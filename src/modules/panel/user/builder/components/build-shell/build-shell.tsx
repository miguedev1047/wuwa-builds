import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildContent } from "@builder/components/build-shell/build-content"
import { BuildHeader } from "@builder/components/build-shell/build-header"

export function BuildShell() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  if (!build) return null

  return (
    <div className="flex h-screen w-full flex-col gap-6 overflow-y-auto p-6 md:overflow-hidden">
      <BuildHeader />
      <BuildContent />
    </div>
  )
}
