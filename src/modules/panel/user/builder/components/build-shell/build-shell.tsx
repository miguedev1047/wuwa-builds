import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildContent } from "@builder/components/build-shell/build-content"
import { BuildHeader } from "@builder/components/build-shell/build-header"

export function BuildShell() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  if (!build) return null

  return (
    <div className="container mx-auto flex w-full flex-col gap-6 p-3 md:p-6">
      <BuildHeader />
      <BuildContent />
    </div>
  )
}
