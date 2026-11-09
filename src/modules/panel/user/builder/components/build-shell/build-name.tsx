import { updateBuild } from "@/modules/builds/client/build-store"
import { useBuilderId } from "../../application/use-builder-id"
import { useBuildCollection } from "../../../builds/application/build-live-queries"
import { Input } from "@/components/ui/input"

export function BuildName() {
  const buildId = useBuilderId()

  const { data: build } = useBuildCollection({ buildId })

  const handleChangeBuildName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateBuild(buildId, (current) => {
      current.name = event.target.value
      current.updateAt = new Date().toISOString()
    })
  }

  if (!build) return

  return (
    <Input
      value={build.name}
      className="w-full text-xl placeholder:text-xl"
      placeholder="Nombre de la build"
      onChange={handleChangeBuildName}
    />
  )
}
