import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { BuildCardSection } from "../../../ui/build-card-section"
import { useBuilderId } from "../../../application/use-builder-id"
import { Show } from "@/components/utility/show"

export function ResonatorInfoTrigger() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <Show when={build?.resonator.data}>
      {(resonator) => (
        <BuildCardSection className="relative h-full w-full">
          <div className="absolute inset-0 flex items-start gap-4">
            <img
              src={resonator.iconLarge}
              alt={resonator.name}
              className="h-full mask-r-from-90%"
            />
            <div className="w-full py-4 pr-4">
              <h2 className="text-xl font-bold uppercase">{resonator.name}</h2>
            </div>
          </div>
        </BuildCardSection>
      )}
    </Show>
  )
}
