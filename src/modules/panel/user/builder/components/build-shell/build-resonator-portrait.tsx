import { Show } from "@/components/utility/show"
import { useBuildCollection } from "../../../builds/application/build-live-queries"
import { useBuilderId } from "../../application/use-builder-id"

/** Resonator portrait that opens the resonator selector. */
export function BuildResonatorPortrait() {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <Show when={data?.resonator.data}>
      {(resonator) => (
        <figure className="absolute -bottom-1/2 -left-150 hidden w-375 cursor-pointer transition-transform hover:scale-110 md:block">
          <img className="h-auto w-375" src={resonator.portrait} />
        </figure>
      )}
    </Show>
  )
}
