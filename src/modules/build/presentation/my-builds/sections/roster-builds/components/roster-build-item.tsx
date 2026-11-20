import { Tooltip } from "@/components/panelui/tooltip"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { BuildProps } from "@build/domain/build-record"
import { buildLinkOptions } from "@build/presentation/my-builds/build-link-options"
import { Link } from "@tanstack/react-router"

type RosterBuildItemProps = {
  /** Build shown inside the roster Sheet. */
  build: BuildProps
}

/** Build card inside the roster Sheet, linked to its editor. */
export function RosterBuildItem({ build }: RosterBuildItemProps) {
  return (
    <Show when={build.resonator.data}>
      {(resonator) => (
        <li>
          <Tooltip>
            <Tooltip.Trigger
              render={
                <Link
                  {...buildLinkOptions(build.buildId)}
                  aria-label={build.name}
                >
                  <Image
                    src={resonator.iconLarge}
                    alt=""
                    background="accent"
                    aspect="portrait"
                    size="full"
                    hover="lift"
                  />
                </Link>
              }
            />
            <Tooltip.Content>{build.name}</Tooltip.Content>
          </Tooltip>
        </li>
      )}
    </Show>
  )
}
