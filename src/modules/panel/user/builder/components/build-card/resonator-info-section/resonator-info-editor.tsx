import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { Show } from "@/components/utility/show"
import { ResonatorInfoActions } from "./resonator-info-actions"

/** Placeholder body of the resonator info dialog. */
export function ResonatorInfoEditor() {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <Show when={data}>
      {(build) => (
        <Show when={build.resonator.data}>
          <ResonatorInfoActions build={build} />
        </Show>
      )}
    </Show>
  )
}
