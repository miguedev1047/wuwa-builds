import { Tooltip } from "@/components/panelui/tooltip"
import type { BuildProps } from "@build/domain/build-record"
import { buildLinkOptions } from "@build/presentation/collection/build-link-options"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

type UnassignedBuildItemProps = {
  /** Build that still has no resonator. */
  build: BuildProps
}

/** Draft card that links directly to its editor. */
export function UnassignedBuildItem({ build }: UnassignedBuildItemProps) {
  return (
    <li>
      <Tooltip>
        <Tooltip.Trigger
          render={
            <Link
              {...buildLinkOptions(build.buildId)}
              aria-label={build.name}
              className="grid aspect-2/3 w-full place-content-center rounded-md bg-accent text-muted-foreground transition-colors hover:bg-accent/80 motion-safe:active:scale-95"
            >
              <HugeiconsIcon icon={UserIcon} aria-hidden="true" />
            </Link>
          }
        />
        <Tooltip.Content>{build.name}</Tooltip.Content>
      </Tooltip>
    </li>
  )
}
