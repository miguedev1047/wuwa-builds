import { cn } from "cn"
import { Show } from "@/components/utility/show"
import { useBuildCollection } from "../../../builds/application/build-live-queries"
import { useBuilderId } from "../../application/use-builder-id"

type BuildResonatorPortraitProps = React.ComponentProps<"button">

/** Resonator portrait that opens the resonator selector. */
export function BuildResonatorPortrait({
  className,
  ...props
}: BuildResonatorPortraitProps) {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <Show when={data?.resonator.data}>
      {(resonator) => (
        <button
          {...props}
          type="button"
          aria-label={`Cambiar resonador (${resonator.name})`}
          className={cn(
            "absolute -bottom-1/2 -left-150 hidden w-375 cursor-pointer border-0 bg-transparent p-0 transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:scale-100 md:block",
            className
          )}
        >
          <img
            className="h-auto w-full"
            src={resonator.portrait}
            alt={resonator.name}
          />
        </button>
      )}
    </Show>
  )
}
